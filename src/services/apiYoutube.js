export const GetVideo = async (nameMusic, artistMusic) => {
    const query = `${nameMusic} ${artistMusic}`

    const apiKey = 'AIzaSyAngREoduuV1N1wUk_zHvNeq4fPDIWpTgI';
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&key=${apiKey}`;

    return fetch(apiUrl)
      .then(response => { return response.json() })
      .catch(error => {
        console.error('Erro ao realizar a pesquisa:', error);
      });
  }
