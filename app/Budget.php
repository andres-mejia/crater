<?php

namespace Crater;

use Illuminate\Database\Eloquent\Model;
use Crater\CompanySetting;
use Carbon\Carbon;

class Budget extends Model
{
    //
    const STATUS_DRAFT = 'DRAFT';
    const STATUS_SENT = 'SENT';
    const STATUS_VIEWED = 'VIEWED';
    const STATUS_EXPIRED = 'EXPIRED';
    const STATUS_ACCEPTED = 'ACCEPTED';
    const STATUS_REJECTED = 'REJECTED';

    protected $table = "budgets";
    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
        'budget_date',
        'expiry_date'
    ];

    protected $appends = [
        'formattedExpiryDate',
        'formattedBudgetDate'
    ];

    protected $casts = [
        'total' => 'float',
        'tax' => 'float',
        'sub_total' => 'float'
    ];

    protected $fillable = [];
    
    /*public function items()
    {
        return $this->hasMany('Crater\EstimateItem');
    }*/

    public function user()
    {
        return $this->belongsTo('Crater\User');
    }

    public function taxes()
    {
        return $this->hasMany(Tax::class);
    }

    
    public function getFormattedExpiryDateAttribute($value)
    {
        $dateFormat = CompanySetting::getSetting('carbon_date_format', $this->company_id);
        return Carbon::parse($this->expiry_date)->format($dateFormat);
    }

    public function getFormattedBudgetDateAttribute($value)
    {
        $dateFormat = CompanySetting::getSetting('carbon_date_format', $this->company_id);
        return Carbon::parse($this->budget_date)->format($dateFormat);
    }

    public function scopeBudgetsBetween($query, $start, $end)
    {
        return $query->whereBetween(
            'budgets.budget_date',
            [$start->format('Y-m-d'), $end->format('Y-m-d')]
        );
    }

    public function scopeWhereStatus($query, $status)
    {
        return $query->where('budgets.status', $status);
    }

    public function scopeWhereCode($query, $code)
    {
        return $query->where('budgets.code', $code);
    }

    public function scopeWhereSearch($query, $search)
    {
        foreach (explode(' ', $search) as $term) {
            $query->whereHas('user', function ($query) use ($term) {
                $query->where('name', 'LIKE', '%'.$term.'%')
                    ->orWhere('contact_name', 'LIKE', '%'.$term.'%')
                    ->orWhere('company_name', 'LIKE', '%'.$term.'%');
            });
        }
    }

    public function scopeApplyFilters($query, array $filters)
    {
        $filters = collect($filters);

        if ($filters->get('search')) {
            $query->whereSearch($filters->get('search'));
        }

        if ($filters->get('code')) {
            $query->whereCode($filters->get('code'));
        }

        if ($filters->get('status')) {
            $query->whereStatus($filters->get('status'));
        }

        if ($filters->get('from_date') && $filters->get('to_date')) {
            $start = Carbon::createFromFormat('d/m/Y', $filters->get('from_date'));
            $end = Carbon::createFromFormat('d/m/Y', $filters->get('to_date'));
            $query->estimatesBetween($start, $end);
        }

        if ($filters->get('customer_id')) {
            $query->whereCustomer($filters->get('customer_id'));
        }

        if ($filters->get('orderByField') || $filters->get('orderBy')) {
            $field = $filters->get('orderByField') ? $filters->get('orderByField') : 'code';
            $orderBy = $filters->get('orderBy') ? $filters->get('orderBy') : 'asc';
            $query->whereOrder($field, $orderBy);
        }
    }

    public function scopeWhereOrder($query, $orderByField, $orderBy)
    {
        $query->orderBy($orderByField, $orderBy);
    }

    public function scopeWhereCompany($query, $company_id)
    {
        $query->where('budgets.company_id', $company_id);
    }

    public function scopeWhereCustomer($query, $customer_id)
    {
        $query->where('budgets.user_id', $customer_id);
    }

    public static function deleteBudget($id)
    {
        $estimate = Budget::find($id);

        if ($estimate->items()->exists()) {
            $estimate->items()->delete();
        }

        if ($estimate->taxes()->exists()) {
            $estimate->taxes()->delete();
        }

        $estimate->delete();

        return true;
    }

}
