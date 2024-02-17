import React, { useEffect, useState } from 'react'
import styles from './ModalSaveRepertoire.module.css'
import { GetDate } from '../../../utils/Utils'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../../services/firebaseConfig'
import { ErrorMessage } from '../../alerts/ErrorMessage'

export const ModalSaveRepertoire = ({ open, setOpen, user, repertoire = null, setRepertoire }) => {
  const [form, setForm] = useState({
    name: '',
    description: ''
  })

  useEffect(() => {
    if(open) {
      setForm({
        name: (repertoire ? repertoire.name : ''), 
        description: (repertoire ? repertoire.description : '')
      })
    } else {
      if(setRepertoire) setRepertoire(null)
      setForm({
        name: '', 
        description: ''
      })
    }
  }, [open])

  const saveRepertoire = async () => {
    if(!form.name || !form.description) return

    setOpen(!open)

    if(!repertoire) {
      await addDoc(collection(db, "users", user.uid, "repertoires"), {
        name: form.name,
        description: form.description,
        createdAt: GetDate(),
        creator: user.displayName
      })
      .catch(() => {
        ErrorMessage('Não foi possível salvar o repertório')
      })
    } else {
      await updateDoc(doc(db, "users", user.uid, "repertoires", repertoire.id), {
        name: form.name,
        description: form.description
      })
      .catch(() => {
        ErrorMessage('Não foi possível salvar o repertório')
      })
    }
  }

  return (
    <>
      {open && (
        <div className={styles.ModalSaveRepertoire} onClick={() => setOpen(!open)}>
          <div onClick={(e) => e.stopPropagation()}>
            <div className={styles.ModalSaveRepertoireHeader}>
              <h3>{!repertoire ? 'Criar' : 'Editar'} repertório</h3>
            </div>
            <hr />
            <div className={styles.ModalSaveRepertoireBody}>
              <label htmlFor="name">Nome</label>
              <input placeholder='Nome do repertório' id='name' value={form.name} form={form} setForm={setForm} attribute='name' />
              <label htmlFor="description">Descrição</label>
              <textarea placeholder='Descrição do repertório' id='description' value={form.description} form={form} setForm={setForm} attribute='description' />
            </div>
            <div className={styles.ModalSaveRepertoireFooter}>
              <button className={styles.btnClose} onClick={() => setOpen(!open)}>Cancelar</button>
              <button className={styles.btnSave} onClick={saveRepertoire}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
