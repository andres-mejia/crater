<?php

namespace Crater;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    //
    protected $table = "categorias";
    
    public function parent()
    {
        return $this->belongsTo("Crater\Category","parent_id");
    }

}
