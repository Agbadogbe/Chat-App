FROM node:15.8.0-alpine3.10
EXPOSE 8080
RUN apk update && apk add bash

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sliders</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap">
    <style>
        body {
            font-family: 'Open Sans', sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: #f0f0f0;
            margin: 0;
            padding-top: 20px;
        }

        header {
            text-align: center;
            width: 100%;
        }

        h1 {
            font-size: 2em;
            color: #333;
        }

        .toolbar {
            margin-top: 20px;
            text-align: center;
        }

        .toolbar-toggle {
            text-decoration: none;
            background-color: #007bff;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            display: inline-block;
        }

        .toolbar-buttons {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 10px;
        }

        .toolbar-buttons.hidden {
            display: none;
        }

        .toolbar-buttons button {
            background-color: #6c757d;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1.2em;
        }

        .toolbar-buttons button:hover {
            background-color: #5a6268;
        }

        .slider {
            margin-top: 40px;
            text-align: center;
            border: 5px solid #fff;
            border-radius: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            background-color: #fff;
            padding: 10px;
            transform: rotate(-3deg);
            max-width: 80%;
        }

        .slider img {
            max-width: 100%;
            height: auto;
            border-radius: 15px;
        }

        #slider-caption {
            margin-top: 10px;
            font-size: 1.2em;
            color: #555;
        }
    </style>
</head>
<body>

    <header>
        <h1>Sliders</h1>
        <nav class="toolbar">
            <a href="#" id="toolbar-toggle" class="toolbar-toggle">Afficher/Cacher</a>
            <div id="toolbar-buttons" class="toolbar-buttons hidden">
                <button id="slider-previous" aria-label="Précédent"><i class="fas fa-step-backward"></i></button>
                <button id="slider-toggle" aria-label="Pause/Démarrer"><i class="fas fa-pause"></i></button>
                <button id="slider-next" aria-label="Suivant"><i class="fas fa-step-forward"></i></button>
                <button id="slider-random" aria-label="Aléatoire"><i class="fas fa-random"></i></button>
            </div>
        </nav>
    </header>

    <main>
        <figure id="slider" class="slider">
            <img src="" alt="">
            <figcaption id="slider-caption"></figcaption>
        </figure>
    </main>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const images = [
                {
                    src: 'https://cdn.pixabay.com/photo/2016/11/08/09/25/mountains-1807498_1280.jpg',
                    title: 'Montagnes majestueuses',
                    alt: 'Une vue panoramique de montagnes enneigées sous un ciel bleu.'
                },
                {
                    src: 'https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867623_1280.jpg',
                    title: 'Aurore boréale',
                    alt: 'Un ciel nocturne illuminé par les aurores boréales vertes et violettes.'
                },
                {
                    src: 'https://cdn.pixabay.com/photo/2017/02/01/22/02/road-2031102_1280.jpg',
                    title: 'Forêt mystérieuse',
                    alt: 'Une route sinueuse traversant une forêt dense et brumeuse.'
                },
                {
                    src: 'https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3083283_1280.jpg',
                    title: 'Coucher de soleil sur l\'océan',
                    alt: 'Un magnifique coucher de soleil sur l\'océan, avec des tons de rouge et d\'orange.'
                },
                {
                    src: 'https://cdn.pixabay.com/photo/2016/09/08/11/04/tree-1653064_1280.jpg',
                    title: 'Arbre solitaire',
                    alt: 'Un arbre seul au milieu d\'un champ verdoyant sous un ciel nuageux.'
                }
            ];

            let currentIndex = 0;
            let isPlaying = true;
            let intervalId = null;

            const toolbarToggle = document.getElementById('toolbar-toggle');
            const toolbarButtons = document.getElementById('toolbar-buttons');
            const sliderPrevious = document.getElementById('slider-previous');
            const sliderToggle = document.getElementById('slider-toggle');
            const sliderNext = document.getElementById('slider-next');
            const sliderRandom = document.getElementById('slider-random');
            const sliderImage = document.querySelector('#slider img');
            const sliderCaption = document.getElementById('slider-caption');

            const updateSlider = () => {
                const currentImage = images[currentIndex];
                sliderImage.src = currentImage.src;
                sliderImage.alt = currentImage.alt;
                sliderCaption.textContent = currentImage.title;
            };

            const nextSlide = () => {
                currentIndex = (currentIndex + 1) % images.length;
                updateSlider();
            };

            const previousSlide = () => {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                updateSlider();
            };

            const startCarousel = () => {
                if (!intervalId) {
                    intervalId = setInterval(nextSlide, 3000); // Défilement toutes les 3 secondes
                    isPlaying = true;
                    sliderToggle.innerHTML = '<i class="fas fa-pause"></i>';
                }
            };

            const stopCarousel = () => {
                clearInterval(intervalId);
                intervalId = null;
                isPlaying = false;
                sliderToggle.innerHTML = '<i class="fas fa-play"></i>';
            };

            // Actions des boutons
            toolbarToggle.addEventListener('click', (e) => {
                e.preventDefault();
                toolbarButtons.classList.toggle('hidden');
            });

            sliderNext.addEventListener('click', () => {
                nextSlide();
                stopCarousel();
            });

            sliderPrevious.addEventListener('click', () => {
                previousSlide();
                stopCarousel();
            });

            sliderToggle.addEventListener('click', () => {
                if (isPlaying) {
                    stopCarousel();
                } else {
                    startCarousel();
                }
            });

            sliderRandom.addEventListener('click', () => {
                let newIndex;
                do {
                    newIndex = Math.floor(Math.random() * images.length);
                } while (newIndex === currentIndex);
                currentIndex = newIndex;
                updateSlider();
                stopCarousel();
            });

            // Événements clavier
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight') {
                    nextSlide();
                    stopCarousel();
                } else if (e.key === 'ArrowLeft') {
                    previousSlide();
                    stopCarousel();
                }
            });

            // Initialisation
            startCarousel();
            updateSlider();
        });
    </script>
</body>
</html>
