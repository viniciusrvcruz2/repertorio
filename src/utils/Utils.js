export const GetDate = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const date = `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}`;

    return date
}

export const VideoId = (videoUrl) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(.*\/)?(watch\?v=)?|youtu\.be\/)([a-zA-Z0-9_-]{11})(\S*)?$/;

    const youtubeMatch = videoUrl.match(youtubeRegex);

    if (youtubeMatch) return youtubeMatch[6]

    return ''
  }
