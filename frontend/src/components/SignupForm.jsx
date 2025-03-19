/*
 * Composant SignupForm - Formulaire d'inscription des utilisateurs
 * 
 * Ce formulaire permet aux étudiants et enseignants de s'inscrire sur la plateforme.
 * C'est une version simple avec:
 * - Champ pour le nom complet
 * - Champ pour l'email académique
 * - Sélecteur de rôle (étudiant ou enseignant)
 * - Bouton d'envoi
 * 
 * À faire:
 * - Il manque la gestion du formulaire (pas de state ni de handleSubmit)
 * - Pas de validation des emails académiques
 * - À connecter avec le backend pour l'enregistrement réel des utilisateurs
 * 
 */

import React from 'react';
import styled from 'styled-components';

const SignupSection = styled.section`
  padding: 60px 30px;
  background-color: #f5f7fa;
`;

const Form = styled.form`
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 12px;
  background-color: rgb(15, 110, 173);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgb(49, 137, 196);
    transform: translateY(-2px);
  }
`;

const SignupForm = () => {
  return (
    <SignupSection id="register">
      <h2>Rejoignez-nous</h2>
      <Form>
        <Input type="text" placeholder="Nom complet" required />
        <Input type="email" placeholder="Email académique" required />
        <Select required>
          <option value="">Sélectionnez votre rôle</option>
          <option value="student">Étudiant</option>
          <option value="teacher">Enseignant</option>
        </Select>
        <Button type="submit">Créer un compte</Button>
      </Form>
    </SignupSection>
  );
};

export default SignupForm; 