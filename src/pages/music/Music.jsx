import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './Music.module.css'
import { Header } from '../../components/header/Header'
import { deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { AuthContext } from '../../contexts/AuthContext'
import { db } from '../../services/firebaseConfig'
import { VideoId } from '../../utils/Utils'
import { ModalSaveMusic } from '../../components/modal/ModalSaveMusic/ModalSaveMusic'
import { ErrorMessage } from '../../components/alerts/ErrorMessage'

export const Music = () => {
    const { user } = useContext(AuthContext)
    const navigate = useNavigate();
    const { repertoireId } = useParams()
    const { musicId } = useParams()
    const [showOption, setShowOption] = useState(false)
    const [music, setMusic] = useState({})
    const [newAnnotation, setNewAnnotation] = useState(null)
    const [modalMusicOpen, setModalMusicOpen] = useState(false)
    const [timeoutId, setTimeoutId] = useState(null);

    useEffect(() => {
        getMusic()
    }, [])

    const getMusic = () => {
        onSnapshot(doc(db, "users", user.uid, "repertoires", repertoireId, "musics", musicId), (data) => {
            setMusic({...data.data(), id: musicId})
        })
    }

    const saveAnnotation = async () => {
        updateDoc(doc(db, "users", user.uid, "repertoires", repertoireId, "musics", musicId), {
            lyrics: music.lyrics
        })
    }

    const handleAnnotationChange = async (event, index) => {
        const updatedMusic = { ...music };
        updatedMusic.lyrics[index].annotation = event.target.value;
        setMusic(updatedMusic);

        if (timeoutId) {
            clearTimeout(timeoutId);
        }
      
        const newTimeoutId = setTimeout(() => {
            saveAnnotation()
        }, 3000);
    
        setTimeoutId(newTimeoutId);
    }

    const deleteMusic = () => {
        navigate(`/repertoire/${repertoireId}`)

        deleteDoc(doc(db, "users", user.uid, "repertoires", repertoireId, "musics", musicId))
        .catch(() => {
            ErrorMessage('Erro ao deletar música')
        })
    }

  return (
    <div className={styles.music} onClick={() => { if(showOption) setShowOption(false)}}>
        <Header>
            <i className="fa-solid fa-arrow-left" onClick={() => navigate(`/repertoire/${repertoireId}`)}></i>
            <h4>{`${music.name} (${music.tone ? music.tone : '?'})`}</h4>
            <span onClick={() => setShowOption(!showOption)}>
                <i className="fa-solid fa-ellipsis-vertical"></i>
            </span>
            {showOption && <ul>
                <li onClick={() => setModalMusicOpen(!modalMusicOpen)}>Editar</li>
                <li onClick={() => deleteMusic()}>Excluir</li>
                </ul>}
        </Header>
        <main>
            {music.videoUrl && 
                <div className={styles.videoContainer}>
                    <iframe src={`https://www.youtube.com/embed/${VideoId(music.videoUrl)}`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
                </div>
            }
            <section>
                <div>
                    <h2>{music.name}</h2>
                    <h4>{music.artist}</h4>
                    <h4>Tom: {music.tone}</h4>
                </div>
                <div className={styles.lyrics}>
                    {music.lyrics ? music.lyrics.map((lyrics, index) => (
                        <div onClick={() => newAnnotation === index ? setNewAnnotation(null) : setNewAnnotation(index)} key={index}>
                            <div>
                                {lyrics.lyrics.split('\n').map((line, indexLIne) => (
                                <div key={indexLIne}>{line}</div>
                                ))}
                            </div>
                            {newAnnotation === index ? <textarea className={styles.newAnnotation} placeholder='Digite uma anotação' value={music.lyrics[index].annotation} onChange={(event) => handleAnnotationChange(event, index)} onClick={(e) => e.stopPropagation()}/> : 
                            <div className={styles.annotation}>
                                {lyrics.annotation}
                            </div>}
                        </div>
                    )) : <div>Não contém letra</div>}
                </div>
            </section>
        </main>
        {modalMusicOpen && <ModalSaveMusic open={modalMusicOpen} setOpen={setModalMusicOpen} user={user} repertoireId={repertoireId} music={music} />}
    </div>
  )
}
