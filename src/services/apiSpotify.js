export const GetTrack = async (trackName, artist, tokenApiSpotify) => {
    // if (!tokenApiSpotify || !tokenApiSpotify.expires_in) {
    //   await getTokenApiSpotify()
    // }
    const trackNameWithArtist = `${trackName} ${artist}`

    const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(trackNameWithArtist)}&type=track`;

    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenApiSpotify.access_token}`
      }
    }

    return fetch(searchUrl, requestOptions)
      .then(response => { return response.json() })
      .catch(error => {
        console.error('Erro ao pesquisar música:', error);
      });
  }