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

import React from 'react';

import { 
  SignupSection, 
  Form, 
  Input, 
  Select, 
  Button 
} from '../styles/SignupFormStyles';

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
*/
