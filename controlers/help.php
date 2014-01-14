<?php
/**
 * Created by JetBrains PhpStorm.
 * User: praise
 * Date: 9/20/13
 * Time: 6:44 PM
 * To change this template use File | Settings | File Templates.
 */
require_once("models/config.php");

switch($client_action){
    case "query":
        $alias = @$_POST['alias'];
        $sql = "select * from `help`";
        $help_list = array();

        if($alias){
            $sql = "select * from `help` where (alias=?)";
            $stmt = $mysqli->prepare($sql);
            $stmt->bind_param("s", $alias);
        }else{
            $stmt = $mysqli->prepare($sql);
        }

        $stmt->execute();
        $stmt->bind_result($id, $title, $is, $not, $content, $alias, $time);
        while ($stmt->fetch()){
            $object = new stdClass();
            $object->id = $id;
            $object->title = $title;
            $object->is = $is;
            $object->not = $not;
            $object->content = $content;
            $object->alias = $alias;
            $object->time = $time;
            array_push($help_list, $object);
        }
        $stmt->close();

        $result = array("bizCode" => 1, "memo" => "", "data" => array("helpList"=>$help_list));
        echo json_encode($result);
        break;
    case "is":
        $id = @$_POST['id'];

        if(!$id){
            exit(json_encode(array("bizCode" => 0, "memo" => "没有收到帮助内容的id", "data" => array())));
            break;
        }

        $sql = "select yes from `help` where (id=?)";
        $stmt = $mysqli->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $stmt->bind_result($yes);
        if($stmt->fetch()){
            $stmt->close();

            $new_yes = $yes+1;
            $update_sql = "update help set yes=? where id=?";
            $stmt = $mysqli->prepare($update_sql);
            $stmt->bind_param("ii", $new_yes, $id);
            $stmt->execute();
            if($mysqli->affected_rows){
                echo json_encode(array("bizCode" => 1, "memo" => "成功", "data" => array("yes" => $new_yes)));
            }else{
                echo json_encode(array("bizCode" => 0, "memo" => "数据库写入失败", "data" => array()));
            }
        }else{
            echo json_encode(array("bizCode" => 0, "memo" => "当前帮助内容不存在", "data" => array()));
        }
        $stmt->close();
        exit;
        break;
    case "isnot":
        $id = @$_POST['id'];

        if(!$id){
            exit(json_encode(array("bizCode" => 0, "memo" => "没有收到帮助内容的id", "data" => array())));
            break;
        }

        $sql = "select no from `help` where (id=?)";
        $stmt = $mysqli->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $stmt->bind_result($no);
        if($stmt->fetch()){
            $stmt->close();

            $new_no = $no+1;
            $update_sql = "update help set no=? where id=?";
            $stmt = $mysqli->prepare($update_sql);
            $stmt->bind_param("ii", $new_no, $id);
            $stmt->execute();
            if($mysqli->affected_rows){
                echo json_encode(array("bizCode" => 1, "memo" => "成功", "data" => array("no" => $new_no)));
            }else{
                echo json_encode(array("bizCode" => 0, "memo" => "数据库写入失败", "data" => array()));
            }
        }else{
            echo json_encode(array("bizCode" => 0, "memo" => "当前帮助内容不存在", "data" => array()));
        }
        $stmt->close();
        exit;
        break;
    default:
        exit(json_encode(array("bizCode" => 0, "memo" => "没有action参数", "data" => array())));
        break;
}
?>