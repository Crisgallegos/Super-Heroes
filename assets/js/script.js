$(document).ready(function() {
    $('#Form').submit(function(event) {
        event.preventDefault();
        
        const heroId = $('#heroId').val().trim();
        
        if (!/^\d+$/.test(heroId)) {
            alert("Por favor, ingrese un número válido.");//valida que se igresen solo numeros
            return;
        }

        getHeroData(heroId);
    });

    function getHeroData(heroId) {
        const accessToken = '4905856019427443'; // Token entregado en la ppt
        const apiUrl = `https://www.superheroapi.com/api.php/${accessToken}/${heroId}`; //link obtenido de la API

        $.ajax({
            url: apiUrl,
            method: 'GET',
            success: function(data) {
                //console.log(data); // Mostrar toda la respuesta en la consola

                if (data.response === "error") {
                    alert("No se encontró el superhéroe con ese ID."); //valida que exista el super heroe
                    return;
                }

                renderHeroInfo(data);
                renderHeroChart(data.powerstats);
            },
            error: function() {
                alert("Hubo un error al conectar con la API.");
            }
        });
    }

    //Información de los super heroes obtenida de la API
    function renderHeroInfo(data) {
        $('#heroInfo').html(`
            <div class="card">
                <div class="row no-gutters">
                    <div class="col-md-4">
                        <img src="${data.image.url}" class="card-img hero-img" alt="${data.name}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${data.name}</h5>
                            <p class="card-text"><strong>Nombre completo:</strong> ${data.biography['full-name']}</p>
                            <p class="card-text"><strong>Conexiones:</strong> ${data.connections['group-affiliation'] || 'No disponible'}</p>
                            <p class="card-text"><strong>Género:</strong> ${data.appearance.gender}</p>
                            <p class="card-text"><strong>Primera aparición:</strong> ${data.biography['first-appearance']}</p>
                            <p class="card-text"><strong>Editora:</strong> ${data.biography.publisher}</p>
                            <p class="card-text"><strong>Altura:</strong> ${data.appearance.height[1] || 'No disponible'}</p>
                            <p class="card-text"><strong>Peso:</strong> ${data.appearance.weight[1] || 'No disponible'}</p>
                        </div>
                    </div>
                </div>
            </div>
        `).fadeIn();
    }

    function renderHeroChart(stats) {
        const chartData = [
            { label: "Inteligencia", y: parseInt(stats.intelligence) || 0 },
            { label: "Fuerza", y: parseInt(stats.strength) || 0 },
            { label: "Velocidad", y: parseInt(stats.speed) || 0 },
            { label: "Durabilidad", y: parseInt(stats.durability) || 0 },
            { label: "Poder", y: parseInt(stats.power) || 0 },
            { label: "Combate", y: parseInt(stats.combat) || 0 }
        ];

        const chart = new CanvasJS.Chart("infoTorta", {
            animationEnabled: true,
            theme: "light2",
            title: {
                text: "Estadísticas del Superhéroe"
            },
            data: [{
                type: "pie",
                indexLabel: "{label}: {y}",
                yValueFormatString: "#,##0",
                dataPoints: chartData
            }]
        });
        chart.render();
    }
});

