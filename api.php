<?php



header("Access-Control-Allow-Origin: *");


$data = array(
array('name' => 'Paris', 'value' => 'paris', 'country' => 'France'),
array('name' => 'Londes', 'value' => 'londres', 'country' => 'United-Kingdom'),
array('name' => 'Berlin', 'value' => 'berlin', 'country' => 'Germany'),
array('name' => 'Madrid', 'value' => 'Madrid', 'country' => 'Spain'),
array('name' => 'Moscow', 'value' => 'moscow', 'country' => 'Russia'),
);




echo json_encode($data);

?>
