<?php
/**
 * Created by JetBrains PhpStorm.
 * User: praise
 * Date: 9/20/13
 * Time: 6:44 PM
 * To change this template use File | Settings | File Templates.
 */
include_once('config/config.php');
include_once($libs_dir.'/db.php');
require_once("models/config.php");

$user_id = null;
if(isset($loggedInUser) && $loggedInUser->user_id){
    $user_id = $loggedInUser->user_id;
}

if(!$user_id){
    $result = array("bizCode" => 0, "memo" => "用户未登录", "data"=>array("redirect"=>"login.html"));
    exit(json_encode($result));
}

$db = new DB($db_name,$db_host,$db_username,$db_password);
$db->query("SET NAMES 'UTF8'");

function queryProductById($id){
    global $user_id,$db;
    if(!$id){
        return false;
    }
    $sql = "select * from `products` where (p_id=$id and user_id=$user_id)";
    $data = $db -> queryUniqueObject($sql);

    return $data;
};

if($client_action === "query"){
    $page_num = @$_POST['pageNum'];
    if(!$page_num){
        $page_num = 1;
    }
    $limit_start = 0;
    $limit = @$_POST['limit'];
    $type = @$_POST['type'];
    $countIs0 = @$_POST['countIs0'];
    $count_condition = 'p_count>0';
    $name = @$_POST['name'];
    if($countIs0){
        $count_condition = 'p_count<=0';
    }
    if(!$limit){
        $limit = 10;
    }
    $limit_end = (int)$limit;
    $limit_start = (int)$limit*((int)$page_num-1);

    $sql = "select p_id,p_name,p_count,p_price,p_pic,p_props from `products` where ($count_condition and user_id=$user_id) ORDER BY p_date DESC limit $limit_start,$limit_end";
    if($name){
        $sql = "select p_id,p_name,p_count,p_price,p_pic,p_props from `products` where ($count_condition and user_id=$user_id and (p_name like '%$name%')) ORDER BY p_date DESC limit $limit_start,$limit_end";
    }
    if($type){
        $sql = "select p_id,p_name,p_count,p_price,p_pic,p_props from `products` where (p_type=$type and $count_condition and user_id=$user_id) ORDER BY p_date DESC ".
            "limit $limit_start,$limit_end";
        if($name){
            $sql = "select p_id,p_name,p_count,p_price,p_pic,p_props from `products` where (p_type=$type and $count_condition and user_id=$user_id and (p_name like '%$name%')) ORDER BY p_date DESC ".
                "limit $limit_start,$limit_end";
        }
    }

    $data = $db->queryManyObject($sql);
    $data = array('products' => $data);
    $db->close();

    $result = array("bizCode" => 1, "memo" => "", "data" => $data);
    echo json_encode($result);
}

if($client_action === 'queryById'){
    if(!$_POST['id']){
        $result = array("bizCode" => 0, "memo" => "没有传入商品id", "data" => array());
        echo json_encode($result);
        exit;
    }
    $data = queryProductById($_POST['id']);
    $db->close();
    if(!$data){
        $result = array("bizCode" => 0, "memo" => "该商品不存在或被删除", "data" => array());
        echo json_encode($result);
    }else{
        $result = array("bizCode" => 1, "memo" => "查询成功", "data" => array("product" => $data));
        echo json_encode($result);
    }
}

if($client_action==="update"){
    if(!$_POST['id']){
        $result = array("bizCode" => 0, "memo" => "没有传入商品id", "data" => array());
        echo json_encode($result);
        exit;
    }

    $data = queryProductById($_POST['id']);
    if(!$data){
        $result = array("bizCode" => 0, "memo" => "该商品不存在或被删除", "data" => array());
        echo json_encode($result);
    }else{
        $date = date("Y-m-d H:i:s");
        $name = $data -> p_name;
        $price = $data -> p_price;
        $exist_count = $data -> p_count;
        $type = $data -> p_type;
        $man = $data -> p_man;
        $from = $data -> p_from;
        $count = $exist_count;
        $id = $_POST['id'];

        if($_POST['name']){
            $name = $_POST['name'];
        }
        if($_POST['price']){
            $price = $_POST['price'];
        }
        if($_POST['count']){
            $count = ((int) $exist_count) + (int) $_POST['count'];
        }
        if($_POST['type']){
            $type = $_POST['type'];
        }
        if($_POST['man']){
            $man = $_POST['man'];
        }
        if($_POST['from']){
            $from = $_POST['from'];
        }

        $update_sql = "update `products` set `p_name`='$name',`p_price`='$price',`p_count`='$count',`p_from`='$from',".
            "`p_type`='$type',`p_man`='$man',`p_date`='$date' where (`user_id`=$user_id and `p_id`='$id')";
        $result = $db->query($update_sql);

        if($result){
            $data = queryProductById($_POST['id']);
            echo json_encode(array("bizCode" => 1, "memo" => "更新成功", "data" => array("product" => $data)));
        }else{
            echo json_encode(array("bizCode" => 0, "memo" => "更新失败", "data" => array()));
        }
    }
    $db->close();
}

if($client_action === "add"){
    $name = @$_POST['name'];
    $price = @$_POST['price'];
    $count = @$_POST['count'];
    $type = @$_POST['type'];
    $attachment = @$_POST['attachment'];
    $props = @$_POST['props'];
    $man = @$_POST['man'];
    $from = @$_POST['from'];

    $date = date("Y-m-d H:i:s");

    if(!$name){
        echo json_encode(array("bizCode" => 0, "memo" => "没有商品名称参数", "data" => array()));
        exit;
    }
    if(!$price){
        echo json_encode(array("bizCode" => 0, "memo" => "没有商品价格参数", "data" => array()));
        exit;
    }
    if(!$count){
        echo json_encode(array("bizCode" => 0, "memo" => "没有商品数量参数", "data" => array()));
        exit;
    }
    if(!$attachment){
        echo json_encode(array("bizCode" => 0, "memo" => "没有商品图片参数", "data" => array()));
        exit;
    }

    if(!$from){
        $from = '';
    }
    if(!$man){
        $man = '';
    }
    if(!$props){
        $props = "";
    }

    $query_isExist_sql = "select p_name from products where (p_name='$name' and user_id=$user_id and p_type='$type')";
    $query_isExist = $db->queryUniqueObject($query_isExist_sql);
    if($query_isExist){
        echo json_encode(array("bizCode" => 0, "memo" => "商品名称重复", "data" => array()));
        exit;
    }
    $sql = "insert into products(`user_id`, `p_name`, `p_count`, `p_from`, `p_man`, `p_price`, `p_pic`, `p_props`, `p_date`, ".
        "`p_type`) values ($user_id, '$name', '$count', '$from', '$man', '$price', '$attachment', '$props', '$date', ".
        "'$type')";
    $writed_product = $db->query($sql);
    if($writed_product){
        echo json_encode(array("bizCode" => 1, "memo" => "录入成功", "data" => array()));
        exit;
    }

}

if($client_action === "delete"){
    if(!$_POST['id']){
        $result = array("bizCode" => 0, "memo" => "没有传入商品id", "data" => array());
        echo json_encode($result);
        exit;
    }
    $data = queryProductById($_POST['id']);
    if(!$data){
        $result = array("bizCode" => 0, "memo" => "该商品不存在或被删除", "data" => array());
        $db->close();
        echo json_encode($result);
    }else{
        $delete_sql = "delete from `products` where (p_id=$data->p_id and user_id=$user_id)";
        $delete_result = $db -> query($delete_sql);
        $db->close();
        if($delete_result){
            echo json_encode(array("bizCode" => 1, "memo" => "删除成功", "data" => array()));
        }else{
            echo json_encode(array("bizCode" => 0, "memo" => "删除失败", "data" => array()));
        }
    }
}
?>