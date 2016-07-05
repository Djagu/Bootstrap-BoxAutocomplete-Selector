<?php



header("Access-Control-Allow-Origin: *");


$data = array(
array('name' => 'Paris', 'value' => 'paris', 'country' => 'France', 'category' => 'country'),
array('name' => 'Londes', 'value' => 'londres', 'country' => 'United-Kingdom', 'category' => 'city'),
array('name' => 'Berlin', 'value' => 'berlin', 'country' => 'Germany', 'category' => 'city'),
array('name' => 'Madrid', 'value' => 'Madrid', 'country' => 'Spain', 'category' => 'city'),
array('name' => 'Moscow', 'value' => 'moscow', 'country' => 'Russia', 'category' => 'country'),
);




echo json_encode($data);

?>
