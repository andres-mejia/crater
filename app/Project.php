<?php

namespace Crater;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    //
    protected $table = "proyectos";
    
    public function responsible()
    {
        return $this->belongsTo("Crater\Responsible","responsible_id");
    }
    public function area()
    {
        return $this->belongsTo("Crater\Area","area_id");
    }
}
