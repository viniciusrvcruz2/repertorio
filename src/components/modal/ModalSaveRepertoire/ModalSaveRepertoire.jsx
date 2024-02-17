import React, { useEffect, useState } from 'react'
import styles from './ModalSaveRepertoire.module.css'
import { GetDate } from '../../../utils/Utils'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../../services/firebaseConfig'
import { ErrorMessage } from '../../alerts/ErrorMessage'
import { useForm } from 'react-hook-form'

export const ModalSaveRepertoire = ({ open, setOpen, user, repertoire = null, setRepertoire }) => {
  const { register, handleSubmit, setValue } = useForm()

  useEffect(() => {
    if(open) {
      if(repertoire) {
        for (const field in repertoire) {
          setValue(field, repertoire[field]);
        }
      }
    }
  }, [open])

  const saveRepertoire = async (data) => {
    if(!data.name || !data.description) return

    setOpen(!open)

    if(!repertoire) {
      await addDoc(collection(db, "users", user.uid, "repertoires"), {
        name: data.name,
        description: data.description,
        createdAt: GetDate(),
        creator: user.displayName
      })
      .catch(() => {
        ErrorMessage('Não foi possível salvar o repertório')
      })
    } else {
      await updateDoc(doc(db, "users", user.uid, "repertoires", repertoire.id), {
        name: data.name,
        description: data.description
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
              <input placeholder='Nome do repertório' id='name' {...register('name')} />
              <label htmlFor="description">Descrição</label>
              <textarea placeholder='Descrição do repertório' id='description' {...register('description')} />
            </div>
            <div className={styles.ModalSaveRepertoireFooter}>
              <button className={styles.btnClose} onClick={() => setOpen(!open)}>Cancelar</button>
              <button className={styles.btnSave} onClick={() => handleSubmit(saveRepertoire)()}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
