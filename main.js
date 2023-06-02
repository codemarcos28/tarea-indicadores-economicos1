document.addEventListener('DOMContentLoaded', () => {
  const selectIndicador = document.getElementById('selectIndicador');
  const infoIndicador = document.getElementById('infoIndicador');
  const nombreIndicador = document.getElementById('nombreIndicador');
  const valorIndicador = document.getElementById('valorIndicador');
  const chartIndicador = document.getElementById('chartIndicador').getContext('2d');
  let chartInstance;

  // Cargar los tipos de indicadores disponibles en el selector
  axios.get('https://mindicador.cl/api')
    .then(response => {
      const indicadores = response.data;
      Object.keys(indicadores).forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = indicadores[key].nombre;
        selectIndicador.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error al obtener los tipos de indicadores', error);
    });

  // Manejar el evento de cambio en el selector
  selectIndicador.addEventListener('change', () => {
    const indicadorSeleccionado = selectIndicador.value;
    axios.get(`https://mindicador.cl/api/${indicadorSeleccionado}`)
      .then(response => {
        const datosIndicador = response.data;
        nombreIndicador.textContent = datosIndicador.nombre;
        valorIndicador.textContent = `Valor actual: ${datosIndicador.serie[0].valor}`;
        infoIndicador.style.display = 'block';
        if (chartInstance) {
          chartInstance.destroy();
        }
        const fechas = datosIndicador.serie.map(dato => dato.fecha);
        const valores = datosIndicador.serie.map(dato => dato.valor);
        chartInstance = new Chart(chartIndicador, {
          type: 'bar',
          data: {
            labels: fechas,
            datasets: [{
              label: datosIndicador.nombre,
              data: valores,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            scales: {
              x: {
                display: true,
                title: {
                  display: true,
                  text: 'Fecha'
                }
              },
              y: {
                display: true,
                title: {
                  display: true,
                  text: 'Valor'
                }
              }
            }
          }
        });
      })
      .catch(error => {
        console.error('Error al obtener los datos del indicador', error);
      });
  });
});
