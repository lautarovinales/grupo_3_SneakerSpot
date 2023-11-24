-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 24-11-2023 a las 11:41:34
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `prueba`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,0) NOT NULL,
  `discount` decimal(10,0) DEFAULT NULL,
  `description` varchar(255) NOT NULL,
  `enOferta` tinyint(4) DEFAULT 1,
  `img` varchar(255) DEFAULT NULL,
  `img2` varchar(255) DEFAULT NULL,
  `img3` varchar(255) DEFAULT NULL,
  `img4` varchar(255) DEFAULT NULL,
  `class` varchar(45) NOT NULL,
  `sex` tinyint(4) DEFAULT NULL,
  `sizes` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `discount`, `description`, `enOferta`, `img`, `img2`, `img3`, `img4`, `class`, `sex`, `sizes`) VALUES
(12, 'Air Jordan 2 Retro Low', 110000, 16000, 'Luce un calzado con más de 30 años de legado que se mantiene vigente al día de hoy. El AJ2, que debutó en 1986, fue el hermano pequeño genial de su famoso predecesor, como una versión más elegante y simplificada del AJ1 icónico. Con cuero premium y una un', 1, '1699221175589-533533-800-800.jpg', '1699221175590-556720-800-800.jpg', '1699221175590-550770-800-800.jpg', '1699221175591-572573-800-800.jpg', 'Urban', 1, '42'),
(14, 'Air Jordan 1 Mid', 120000, 12000, 'Inspirada en el AJ1 original, esta edición de corte mid mantiene el look icónico que te encanta, y los colores selectos y el cuero impecable le dan una identidad distintiva.', 1, '1699394440329-454509-800-800.jpg', '1699394440329-465493-800-800.jpg', '1699394440330-612505-800-800.jpg', '1699394440331-483120-800-800.jpg', 'Basket', 1, '40'),
(15, 'Nike Air Max 90 GTX', 114000, 13000, 'Diseñado para que te diviertas cuando comienza a llover, el Nike Air Max 90 GTX ofrece una versión impermeable del calzado de running para campeones que ayudó a definir el look de los 90. Esta edición codiciada de eficacia probada presenta una parte super', 1, '1699394772832-452923-800-800.jpg', '1699394772833-469358-800-800.jpg', '1699394772833-463918-800-800.jpg', '1699394772834-481820-800-800.jpg', 'Urbano', 1, '41'),
(16, 'Nike Air Max 90 SE', 120000, 13000, 'Un diseño histórico. Rinde homenaje a Frank Rudy, el hombre que creó la codiciada piedra angular de la amortiguación (Air), este calzado celebra su legado con detalles divertidos. Desde la fecha de lanzamiento estampada orgullosamente en la unidad Air, ha', 1, '1699396181674-629134-800-800.jpg', '1699396181675-639659-800-800.jpg', '1699396181675-637734-800-800.jpg', '1699396181675-645541-800-800.jpg', 'Urban', 1, '40'),
(17, 'Nike SB Nyjah 3', 100000, 15000, 'Ligero. Simple. Moderno. El Nyjah 3 ofrece la próxima versión del calzado de skateboarding que es tan extraordinario como Nyjah. La tecnología Zoom Air en el talón se combina con una suela tipo panal, adherente y ligera como una pluma.', 1, '1699396346439-452854-800-800.jpg', '1699396346439-463849-800-800.jpg', '1699396346439-610872-800-800.jpg', '1699396346440-481751-800-800.jpg', 'Urban', 1, '44'),
(18, 'Nike Zoom Fly 4', 133000, 13000, 'Entrena con fuerza y encuentra tu ritmo. El Nike Zoom Fly 4 se siente seguro y altamente eficaz, con flexibilidad adicional en cada pisada. La parte superior suave y transpirable se combina con un cuello elástico para brindar un ajuste similar al de un ca', 1, '1699396439673-439744-800-800.jpg', '1699396439673-444164-800-800.jpg', '1699396439674-447223-800-800.jpg', '1699396439678-448245-800-800.jpg', 'Running', 0, '39'),
(21, 'Nike Flex Advance SE', 100000, 10000, 'Sigue el rastro de las huellas que deja tu pequeño cuando luce las botas Nike Flex Advance SE. El forro de tejido Fleece grueso mantiene los pies de los más pequeños cálidos y abrigados, y el cuero sintético en la parte exterior aporta durabilidad. Además', 1, '1700821224865-311654-800-800.png', '1700821224866-314781-800-800.png', '1700821224866-314024-800-800.png', '1700821224866-xd.png', 'Kids', 0, '39, 38, 37');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `img` varchar(255) DEFAULT NULL,
  `type` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `img`, `type`) VALUES
(29, 'laucha', 'lautarovinales20@gmail.com', '$2b$10$gDpMw/4tnLHbrxnBiMBxJ.GANGpHPc5z95tPnQttV/ocn.tNRKmwe', '1700348558035-20-adorable-chubby-puppies-that-could-easily-be-mistaken-for-teddy-bears-02.png', 'admin'),
(31, 'laucharo2', 'lautarovinales16@gmail.com', '$2b$10$xnA1tFBsDTYD9UlKQ8O94ezbJ6R8MRvfyIl0kbwFGDueV2OIV5gNO', '1699031780291-20-adorable-chubby-puppies-that-could-easily-be-mistaken-for-teddy-bears-02.png', 'user');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_UNIQUE` (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_UNIQUE` (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
