<?php

namespace Crater;

use Illuminate\Database\Eloquent\Model;

class Area extends Model
{
    protected $table = "areas";

    //
    public function parent()
    {
        return $this->belongsTo("Crater\Area","parent_id");
    }

    public function responsible()
    {
        return $this->belongsTo("Crater\Responsible","responsible_id");
    }
}
