<?php
namespace Crater\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BudgetsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $rules = [
            'name' => 'required',
            'code' => 'required|unique:budgets,code',
            'user_id' => 'required',
            /*'budget_date' => 'required',
            'expiry_date' => 'required',
            'budget_number' => 'required|unique:budgets,budget_number',
            'discount' => 'required',
            'discount_val' => 'required',
            'sub_total' => 'required',
            'total' => 'required',
            'tax' => 'required',
            'budget_template_id' => 'required',
            'items' => 'required|array',
            'items.*.description' => 'max:255',
            'items.*' => 'required|max:255',
            'items.*.name' => 'required',
            'items.*.quantity' => 'required',
            'items.*.price' => 'required'*/
        ];

        if ($this->getMethod() == 'PUT') {
            $rules['code'] = $rules['code'].','.$this->get('id');
        }

        return $rules;
    }
}
