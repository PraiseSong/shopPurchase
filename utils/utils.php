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
        $start_s = preg_split("/\-/", $start);
        $end_s = preg_split("/\-/", $end);
        $start_y = $start_s[0];
        $start_m = $start_s[1];
        $start_d = $start_s[2];
        $end_y = $end_s[0];
        $end_m = $end_s[1];
        $end_d = $end_s[2];

        if(
            ($end_y < $start_y)
            ||
            (($end_y === $start_y) && ($end_m < $start_m))
            ||
            (($end_y === $start_y) && ($end_m === $start_m) && ($end_d < $start_d))
        ){
            return '结束时间小于开始时间';
        }

        array_push($result, $start);
        if($start_y === $end_y){
            if($start_m === $end_m){
                for(;($start_d++) < $end_d;){
                    if($start_d < 10){
                        $start_d = '0'.$start_d;
                    }
                    array_push($result, "$start_y-$start_m-$start_d");
                }
            }else if($start_m < $end_m){
                $months = array();
                for($i = $start_m*1; $i < $end_m+1; $i++){
                    array_push($months, $i);
                }
                foreach($months as $k => $m){
                    if($m < 10){
                        $m = '0'.$m;
                    }
                    if($k === 0){
                        for($k = ($start_d*1)+1; $k < 32; $k++){
                            if($k < 10){
                                $k = '0'.$k;
                            }
                            array_push($result, "$start_y-$m-$k");
                        }
                    }else if($k !== (count($months)-1)){
                        for($k = 1; $k < 32; $k++){
                            if($k < 10){
                                $k = '0'.$k;
                            }
                            array_push($result, "$start_y-$m-$k");
                        }
                    }else{
                        for($k = 1; $k < $end_d+1; $k++){
                            if($k < 10){
                                $k = '0'.$k;
                            }
                            array_push($result, "$end_y-$m-$k");
                        }
                    }
                }
            }
        }else if($end_y > $start_y){
            return '暂时不支持跨年度查询';
        }
    }else{
        return "缺少开始或结束时间参数";
    }

    return $result;
}
?>