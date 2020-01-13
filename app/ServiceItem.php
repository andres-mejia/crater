<?php

namespace Crater;

use Illuminate\Database\Eloquent\Model;

class ServiceItem extends Model
{
    //
    protected $table = "tbl_services";

    // relations with detail 

    // invoicing
    // budgets
    // expenses

    // relations with masters

    public function category()
    {
        return $this->belongsTo("Crater\Category","categoria_id");
    }

    public function subCategory()
    {
        return $this->belongsTo("Crater\Category","subcategoria_id");
    }

    public function area()
    {
        return $this->belongsTo("Crater\Area","area_id");
    }

    public function subArea()
    {
        return $this->belongsTo("Crater\Area","subarea_id");
    }

    
    public function project()
    {
        return $this->belongsTo("Crater\Project","proyecto_id");
    }
    
    public function budget()
    {
        return $this->belongsTo("Crater\BudgetType","tipo_presupuesto_id");
    }
    
    public function rgt()
    {
        return $this->belongsTo("Crater\BusinessTypeRgt","tipo_negocio_id");
    }

    public function expense()
    {
        return $this->belongsTo("Crater\ExpenseType","tipo_gasto_id");
    }

    public function development()
    {
        return $this->belongsTo("Crater\DevelopmetType","tipo_desarrollo_id");
    }

    public function typology()
    {
        return $this->belongsTo("Crater\Typology","tipologia_id");
    }

    public function variability()
    {
        return $this->belongsTo("Crater\VariabilityType","tipo_variabilidad_id");
    }

    public function businessArea()
    {
        return $this->belongsTo("Crater\BusinessArea","area_negocio_id");
    }

    public function responsible()
    {
        return $this->belongsTo("Crater\Responsible","responsable_id");
    }

    public function owner()
    {
        return $this->belongsTo("Crater\Owner","propietario_id");
    }

    public function recurrency()
    {
        return $this->belongsTo("Crater\RecurrencyType","tipo_recurrencia_id");
    }

    public function society()
    {
        return $this->belongsTo("Crater\Society","sociedad_id");
    }

    public function criteria()
    {
        return $this->belongsTo("Crater\DistributionType","tipo_criterio_id");
    }

}
