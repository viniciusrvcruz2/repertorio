import React, { useContext, useEffect, useState } from 'react'
import { auth, db } from '../../services/firebaseConfig';
import { signOut } from 'firebase/auth';
import styles from './Repertoires.module.css'
import { ModalSaveRepertoire } from '../../components/modal/ModalSaveRepertoire/ModalSaveRepertoire';
import { AuthContext } from '../../contexts/AuthContext';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { ErrorMessage } from '../../components/alerts/ErrorMessage';

export const Repertoires = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate();
  const [repertoires, setRepertoires] = useState([])
  const [repertoireSelected, setRepertoireSelected] = useState(null)
  const [showOption, setShowOption] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [repertoiresFilter, setRepertoiresFilter] = useState('')

  useEffect(() => {
    getRepertoires()
  }, [])

  const getRepertoires = async () => {    
    onSnapshot(collection(db, "users", user.uid, "repertoires"), (data) => {
        if(data) {
          setRepertoires(data.docs.map((repertoire) => ({...repertoire.data(), id: repertoire.id})))
        } else {
          setRepertoires([])
        }
    })
  }

  const deleteRepertoire = (repertoireId) => {
    deleteDoc(doc(db, "users", user.uid, "repertoires", repertoireId))
    .catch(() => {
      ErrorMessage('Erro ao deletar repertório')
    })
  }

  const sair = () => {
    signOut(auth)
  }
  
  return (
    <div className={styles.repertoires}  onClick={() => { if(showOption) setShowOption(null) }}>
      <div className={styles.header}>
        <h1>Repertórios</h1>
        <button onClick={sair}>sair</button>
      </div>
      <input placeholder='Pesquisar repertórios' onChange={(e) => setRepertoiresFilter(e.target.value.toLowerCase())}/>
      <hr />
      {repertoires && repertoires.filter(repertoire => {
        return repertoire.name.toLowerCase().includes(repertoiresFilter)
      }).map((repertoire, index) => (
          <div className={styles.repertoireCard} key={index} onClick={() => navigate(`/repertoire/${repertoire.id}`)}>
            <div>
              <div className={styles.repertoireCardHeader}>
                <h4>{repertoire.name}</h4>
                {/* <span>20 músicas</span> */}
                <div onClick={(e) => e.stopPropagation()}>
                  <span onClick={() => setShowOption(showOption !== repertoire.id ? repertoire.id : null)}>
                    <i className="fa-solid fa-ellipsis"></i>
                  </span>
                  {showOption === repertoire.id && <ul>
                    <li onClick={() => {setModalOpen(true), setRepertoireSelected(repertoire)}}>Editar</li>
                    <li onClick={() => deleteRepertoire(repertoire.id)}>Excluir</li>
                  </ul>}
                </div>
              </div>
              <div className={styles.repertoireCardBody}>
                <p>Criado em: {repertoire.createdAt}</p>
                <p>Criador: {repertoire.creator}</p>
                <p>Descrição: {repertoire.description}</p>
              </div>
            </div>
          </div>
      ))}
      <button className={styles.BtnOpenModal} onClick={() => setModalOpen(!modalOpen)}><i className="fa-solid fa-plus"></i></button>
      <ModalSaveRepertoire open={modalOpen} setOpen={setModalOpen} user={user} repertoire={repertoireSelected} setRepertoire={setRepertoireSelected}/>
    </div>
  )
}
