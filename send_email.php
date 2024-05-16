<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $sender = $_POST['sender'];
    $subject = $_POST['subject'];
    $message = $_POST['message'];

    $to = "va.rhennnnn@gmail.com"; // Replace with your email address
    $headers = "From: $sender";
    
    if (mail($to, $subject, $message, $headers)) {
        echo "Email sent successfully!";
    } else {
        echo "Error: Email not sent.";
    }
} else {
    echo "Error: Invalid request.";
}
?>
