<?php
/**
 * Created by JetBrains PhpStorm.
 * User: praise
 * Date: 11/10/13
 * Time: 7:51 PM
 * To change this template use File | Settings | File Templates.
 */
function getDateRange($start, $end){
    $result = array();

    if($start && $end){
        array_push($result, $start);
        $start = preg_split("/\-/", $start);
        $end = preg_split("/\-/", $end);
        $start_y = $start[0];
        $start_m = $start[1];
        $start_d = $start[2];
        $end_y = $end[0];
        $end_m = $end[1];
        $end_d = $end[2];
        if($start_y === $end_y){
            if($start_m === $end_m){
                for(;($start_d++) < $end_d;){
                    if($start_d < 10){
                        $start_d = '0'.$start_d;
                    }
                    array_push($result, "$start_y-$start_m-$start_d");
                }
            }
        }
    }

    return $result;
}
?>