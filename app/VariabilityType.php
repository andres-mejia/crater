<?php

namespace Crater;

use Illuminate\Database\Eloquent\Model;

class VariabilityType extends Model
{
    //
    protected $table = "tipo_variabilidades";
    
    public function category()
    {
        return $this->belongsTo("Crater\VariabilityCategory","category_id");
    }

}
