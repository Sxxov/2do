<?php

    namespace api\v1\lib\reminder;

    class Reminder {

        //All API functions for reminders
        
        public function createReminder(){
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                // Retrieve task data from the request body
                $data = //json_decode(file_get_contents('php://input'), true);
            
                // Insert the task into the database
                $stmt = prepare("INSERT INTO reminder (remind_title, description, due_date) VALUES (?, ?, ?)");
                $stmt->execute([$data['remind_title'], $data['description'], $data['due_date']]);
            
                // Return a success response
                http_response_code(201);
                echo json_encode(['message' => 'Task reminder created successfully']);
            }
        }

        public function getReminder(){
            if ($_SERVER['REQUEST_METHOD'] === 'GET') {
                // Retrieve all task reminders from the database
                $stmt = query("SELECT * FROM reminder");
                $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
                // Return the task reminders as JSON
                echo json_encode($tasks);
            }
        }

        public function editReminder(){
            // Handle task reminder update
            if ($_SERVER['REQUEST_METHOD'] === 'PUT' && isset($_GET['remind_id'])) {
                $taskId = $_GET['remind_id'];

                // Retrieve task data from the request body
                $data = json_decode(file_get_contents('php://input'), true);

                // Check if the task exists
                $stmt = prepare("SELECT * FROM reminder WHERE remind_id = ?");
                $stmt->execute([$taskId]);
                $task = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($task) {
                    // Update the task in the database
                    $stmt = prepare("UPDATE reminder SET remind_title = ?, description = ?, due_date = ? WHERE remind_id = ?");
                    $stmt->execute([$data['remind_title'], $data['description'], $data['due_date'], $taskId]);

                    // Return a success response
                    http_response_code(200);
                    echo json_encode(['message' => 'Task reminder updated successfully']);
                } else {
                    // Return an error response if the task doesn't exist
                    http_response_code(404);
                    echo json_encode(['error' => 'Task reminder not found']);
                }
            }
        }

        public function deleteReminder(){
            // Handle task reminder deletion
            if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['id'])) {
                $taskId = $_GET['id'];

                // Check if the task exists
                $stmt = prepare("SELECT * FROM reminder WHERE id = ?");
                $stmt->execute([$taskId]);
                $task = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($task) {
                    // Delete the task from the database
                    $stmt = prepare("DELETE FROM reminder WHERE id = ?");
                    $stmt->execute([$taskId]);

                    // Return a success response
                    http_response_code(200);
                    echo json_encode(['message' => 'Task reminder deleted successfully']);
                } else {
                    // Return an error response if the task doesn't exist
                    http_response_code(404);
                    echo json_encode(['error' => 'Task reminder not found']);
                }
            }
        }

        public function alertReminder(){
            if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'alerts') {
                // Calculate the date one week from now
                $oneDayFromNow = date('Y-m-d H:i:s', strtotime('+1 Day'));
            
                // Retrieve the task reminders that are not completed and due within one week
                $stmt = prepare("SELECT * FROM reminder WHERE due_date < ? AND completed = 0");
                $stmt->execute([$oneDayFromNow]);
                $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
                // Send the alert for each task
                foreach ($tasks as $task) {
                    sendAlert($task['title']);
                }
            
                // Return a success response
                http_response_code(200);
                echo json_encode(['message' => 'Alerts sent successfully']);
            }
        }
    }


?>