<?php
@include_once('config.php');

$attachments_dir = "../attachments";

$name = @$_POST['name'];
$price = @$_POST['price'];
$count = @$_POST['count'];
$man = @$_POST['man'];
$from = @$_POST['from'];
$props = @$_POST['properties'];
$pic = @$_FILES['pic'];

$error_msg = '';

if ($pic["error"] > 0)
{
    $error_msg = '图片上传错误';
}else{
    if (file_exists("$attachments_dir/" . $pic["name"]))
    {
        $error_msg = '图片已存在';
    }else{
        move_uploaded_file($pic["tmp_name"], "$attachments_dir/" . $pic["name"]);
    }
}
//$author = @$_POST['author'];
//$type = @$_POST['type'];
//$thumb = @$_POST['thumb'];
//
//$created_tem_dir = false;
//
//if(!$js){
//    $js = "该模版没有js代码";
//}
//
//if(!$tms){
//    $tms = "该模版没有tms代码";
//}
//
//function getCategories(){
//    global $dpl_dir;
//    $handle = fopen($dpl_dir.'/'."categories.md", 'r');
//    $buffers = array();
//    $len = filesize($dpl_dir.'/'."categories.md");
//    if((int)$len < 2){
//        return $buffers;
//    }
//    if ($handle) {
//        while (($buffer = fgets($handle, $len)) !== false) {
//            if(strlen(trim($buffer)) > 2){
//                $type = preg_split("/\s/", $buffer);
//                array_push($buffers, json_encode(array("name"=>$type[1], "id"=>$type[0])));
//            }
//        }
//        if (!feof($handle)) {
//            echo "靠！发生了怪异的事情，找颂赞吧";
//        }
//        fclose($handle);
//    }
//    return $buffers;
//}
?>

<?php
//新增分类
//if($action == "add_type"){
//    $type_id = @$_POST['id'];
//    if(!$name){
//        exit("缺少新增分类的name");
//    }
//    if(!$type_id){
//        exit("缺少新增分类的id");
//    }
//    foreach(getCategories() as $k => $category){
//        $class = "";
//        if($k === 0){
//            $class = "active";
//        }
//        $category = json_decode($category);
//        if($category->name === $name){
//            exit("分类名称已存在");
//        }else if($category->id === $type_id){
//            exit("分类id已存在");
//        }
//    }
//
//    $cate_handle = fopen($dpl_dir."/categories.md", 'a');
//    $writed = fwrite($cate_handle, "\n".$type_id." ".$name);
//
//    if($writed){
//        exit("success");
//    }else{
//        exit("新增分类失败");
//    }
//
//    exit;
//}
//
////检查模版文件夹是否重名
//if($action == "check_tem_name"){
//    if(is_dir($dpl_dir."/".$en_name)){
//        echo "yes";
//    }else{
//        echo "no";
//    }
//    exit;
//}
//
////生成随机文件名
//if($action == "generate_temName"){
//    $date = new DateTime();
//    exit(md5($date->format('Y-m-d H:i:s')));
//}
?>
