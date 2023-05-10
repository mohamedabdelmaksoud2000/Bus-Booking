-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 09, 2023 at 05:44 AM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bus-booking`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointment`
--

CREATE TABLE `appointment` (
  `Appointment_id` int(11) NOT NULL,
  `fromm` varchar(255) NOT NULL,
  `too` varchar(255) NOT NULL,
  `Ticket_price` int(11) NOT NULL,
  `day_and_time` varchar(255) NOT NULL,
  `max_num_trav` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `appointment`
--

INSERT INTO `appointment` (`Appointment_id`, `fromm`, `too`, `Ticket_price`, `day_and_time`, `max_num_trav`) VALUES
(1, 'Cairo', 'Elmassara', 250, '3:00 - 6:00', 10),
(2, 'Cairo', 'Helwan', 300, '4:00 - 6:00', 12),
(13, 'giza', 'port', 220, '10/10/2020 1:00', 14);

-- --------------------------------------------------------

--
-- Table structure for table `movies`
--

CREATE TABLE `movies` (
  `id` int(11) NOT NULL,
  `busNumber` int(11) NOT NULL,
  `seatsBooked` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `movies`
--

INSERT INTO `movies` (`id`, `busNumber`, `seatsBooked`, `status`) VALUES
(1, 1, '10', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` int(13) NOT NULL,
  `password` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `role` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0 -> normal user\r\n1-> admin user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`, `token`, `role`) VALUES
(8, 'admin admin', 'admin@admin.com', 0, '$2b$10$VL3Upo/PRJNMqDh3piRYdepxDQQlWAafUlYr4.7yiATOVjriul5QW', '113c8cd3a234b0f95ef0d400fe462997', 1),
(9, 'ahmed gamal', 'ahmed@gmail.com', 0, '$2b$10$4Ce7v0pqKQuWtal907tjieuZzaTRSj5a1in63WFsl5ff8livMyB2W', '6ac9baa3c145b0a3b954d3e516bc4407', 1),
(10, 'ehaa', 'ehab@gmail.com', 123132165, '$2b$10$JGcukRkV/VkUBdcV6m4Rc.6VUDfKNUVUmWpS78auf2m.8NPiesQ.O', '6fd6d3238926093c9568d1cd1b3940b6', 0),
(18, 'bebo ali', 'bebo@gmail.com', 1777777777, '$2b$10$maOIX9FTPqIG7tDHxH28oOf9VPvCPQP1l4cnMqfhxD6.mHxlknutW', 'c4050bf0cf7c93a1e167e3d492a20ccb', 0),
(19, 'ehaa mohamed', 'ehab@gmail.com', 2147483647, '$2b$10$BPWHkKqxNExSBCwhfWZ3we0huf2CziwUzlaPLSxIgRi4EF/QFBBhK', '87baee864fd7ab6123a0cbc228360c88', 0),
(24, 'traveler nsn', 'traveler@gmail.com', 1205151164, '$2b$10$3rmYnCyCh62814Nd1PkPceoP2d9IWW2s2BPA0VJhPVd.JxYB9HCIG', '63fd46897697d92d0864b9ecd4a6c7a2', 0);

-- --------------------------------------------------------

--
-- Table structure for table `user_movie_review`
--

CREATE TABLE `user_movie_review` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `appointment_id` int(11) NOT NULL,
  `request` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_movie_review`
--

INSERT INTO `user_movie_review` (`id`, `user_id`, `appointment_id`, `request`, `status`) VALUES
(21, 9, 2, 'Please, i want this appointment soon', 'Accepted'),
(22, 9, 2, 'Please, i want this appointment soon', 'Rejected'),
(27, 9, 1, 'Please, i want this appointment now', 'Rejected'),
(28, 18, 1, 'Please, want appointment', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointment`
--
ALTER TABLE `appointment`
  ADD PRIMARY KEY (`Appointment_id`);

--
-- Indexes for table `movies`
--
ALTER TABLE `movies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_movie_review`
--
ALTER TABLE `user_movie_review`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_constr_id` (`user_id`),
  ADD KEY `appointment_constr_id` (`appointment_id`) USING BTREE;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointment`
--
ALTER TABLE `appointment`
  MODIFY `Appointment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `movies`
--
ALTER TABLE `movies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `user_movie_review`
--
ALTER TABLE `user_movie_review`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `user_movie_review`
--
ALTER TABLE `user_movie_review`
  ADD CONSTRAINT `appointment_constr_id` FOREIGN KEY (`appointment_id`) REFERENCES `appointment` (`Appointment_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_constr_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
