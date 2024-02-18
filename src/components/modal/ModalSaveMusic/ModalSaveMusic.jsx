import React, { useContext, useEffect, useState } from 'react'
import styles from './ModalSaveMusic.module.css'
import { VideoId } from '../../../utils/Utils'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../../services/firebaseConfig'
import { AuthContext } from '../../../contexts/AuthContext'
import { GetTrack } from '../../../services/apiSpotify'
import { GetLyrics } from '../../../services/apiVagalume'
import { GetVideo } from '../../../services/apiYoutube'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '../../alerts/ErrorMessage'

export const ModalSaveMusic = ({ open, setOpen, user, repertoireId, music = null }) => {
  const { tokenApiSpotify } = useContext(AuthContext)
  const { register, handleSubmit, setValue, getValues } = useForm()
  const [videoId, setVideoId] = useState('')
  const [image, setImage] = useState('')
  const [showVideo, setShowVideo] = useState(false)

  useEffect(() => {
    if(open) {
      if(music) {
        let formatMusic = {...music}

        if(formatMusic.lyrics) {
          formatMusic.lyrics = formatMusic.lyrics.map(paragraph => paragraph.lyrics).join('\n\n');
        }

        for (const field in formatMusic) {
          setValue(field, formatMusic[field]);
        }
      }
    }
  }, [open])

  const setDataAutomatically = async () => {
    const artist = getValues('artist')
    const name = getValues('name')
    if (!name || !artist) return

    GetVideo(name, artist)
      .then(video => {
        if (video.items) {
          setValue('videoUrl', `https://www.youtube.com/watch?v=${video.items[0].id.videoId}`)
          setShowVideo(false)

          setImage(video.items[0].snippet.thumbnails.default.url)
        }
      })

    GetTrack(name, artist, tokenApiSpotify).then((track) => {
        if(track.tracks.items[0]) {
          setValue('audioUrl', track.tracks.items[0].external_urls.spotify) 

          if(!image) {
            if(track.tracks.items[0].album.image) {
              setImage(track.tracks.items[0].album.image[0].url)
            }
          }
        }
      })
    
    GetLyrics(name, artist)
      .then(data => {
        if (data.mus) {
          setValue('lyrics', data.mus[0].text)
        } else {
          setValue('lyrics', '')
        }
      })
  }

  const getVideoId = () => {

    const videoId = VideoId(getValues('videoUrl'))
    
    if (videoId) {
      setVideoId(videoId)
      setShowVideo(true)
    }
  }

  const saveMusic = async (data) => {
    if (!data.name || !data.artist) return

    let formatLyrics = []

    if (data.lyrics) {
      formatLyrics = data.lyrics.split('\n\n');
      formatLyrics = formatLyrics.map((paragraph, index) => ({ 
        lyrics: paragraph, 
        annotation: music ? music.lyrics[index] ? music.lyrics[index].annotation : '' : ''
      }));
    }

    setOpen(!open)

    if(!music) {
      await addDoc(collection(db, "users", user.uid, "repertoires", repertoireId, "musics"), {
        name: data.name,
        artist: data.artist,
        tone: data.tone,
        bpm: data.bpm,
        lyrics: formatLyrics,
        videoUrl: data.videoUrl,
        audioUrl: data.audioUrl,
        image: image
      }).catch(() => {
        ErrorMessage('Não foi possível salvar a música')
      })
    } else {
      await updateDoc(doc(db, "users", user.uid, "repertoires", repertoireId, "musics", music.id), {
        name: data.name,
        artist: data.artist,
        tone: data.tone,
        bpm: data.bpm,
        lyrics: formatLyrics,
        videoUrl: data.videoUrl,
        audioUrl: data.audioUrl,
        image: image ? image : music.image ? music.image : ''
      }).catch(() => {
        ErrorMessage('Não foi possível salvar o música')
      })
    }

    setShowVideo(false)
  }

  return (
    <div className={styles.ModalSaveMusic} onClick={() => setOpen(!open)}>
      <div onClick={(e) => e.stopPropagation()}>
        <div className={styles.ModalSaveMusicHeader}>
          <h3>{music ? 'Editar música' : 'Adicionar uma música'}</h3>
        </div>
        <hr />
        <div className={styles.ModalSaveMusicBody}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Nome da música</label>
            <input 
              placeholder='Nome da música' 
              id='name' 
              {...register('name')}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="artist">Artista/Banda</label>
            <input 
              placeholder='Artista ou Banda' 
              id='artist'
              {...register('artist')}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="tone">Tom</label>
            <select id='tone' {...register('tone')}>
              <option value="C">C</option>
              <option value="C#">C#</option>
              <option value="D">D</option>
              <option value="D#">D#</option>
              <option value="E">E</option>
              <option value="F">F</option>
              <option value="F#">F#</option>
              <option value="G">G</option>
              <option value="G#">G#</option>
              <option value="A">A</option>
              <option value="A#">A#</option>
              <option value="B">B</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="bpm">BPM</label>
            <input 
              type='number' 
              placeholder='BPM da música' 
              id='bpm'
              {...register('bpm')}
            />
          </div>
          <button onClick={() => setDataAutomatically()}><i className="fa-solid fa-bolt"></i> Gerar dados automaticamente</button>
          <div className={styles.inputGroup}>
            <label htmlFor="videoUrl">Vídeo</label>
            <div className={styles.inputIcon}>
              <input 
                type='url' 
                placeholder='https://...' 
                id='videoUrl' 
                {...register('videoUrl')}
              />
              <i className={`fa-solid fa-eye${showVideo ? '-slash' : ''}`} onClick={() => showVideo ? setShowVideo(false) : getVideoId()}></i>
            </div>
          </div>
          {showVideo && <iframe width="100%" height="auto" id='video' src={`https://www.youtube.com/embed/${videoId}`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>}
          <div className={styles.inputGroup}>
            <label htmlFor="audioUrl">Áudio</label>
            <div className={styles.inputIcon}>
              <input 
                type='url' 
                placeholder='https://...' 
                id='audioUrl'
                {...register('audioUrl')}
              />
              <i className="fa-solid fa-arrow-up-right-from-square" onClick={() => audioUrl && window.open(`${getValues('audioUrl')}`, '_blank')}></i>
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="lyrics">Letra</label>
            {music?.lyrics && <span className={styles.addParagraph}>Atenção ao adicionar um parágrafo novo, você poderá perder suas anotações!</span>}
            <textarea 
              placeholder='Letra da música' 
              id='lyrics'
              {...register('lyrics')}
              />
          </div>
        </div>
        <div className={styles.ModalSaveMusicFooter}>
          <button className={styles.btnClose} onClick={() => setOpen(!open)}>Cancelar</button>
          <button className={styles.btnSave} onClick={() => handleSubmit(saveMusic)()}>Salvar</button>
        </div>
      </div>
    </div>
  )
}
