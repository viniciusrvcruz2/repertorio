export const GetLyrics = async (nameMusic, artistMusic) => {
    
    const token = "f260c4df81d7b849758ebc2f8094ba5e";
    return fetch(`https://api.vagalume.com.br/search.php?art=${encodeURIComponent(artistMusic)}&mus=${encodeURIComponent(nameMusic)}&apikey=${token}`, {
      method: 'GET'
    })
      .then(response => { return response.json() })
      .catch(error => {
        console.error('Erro ao obter lista de livros:', error);
      })
  }
