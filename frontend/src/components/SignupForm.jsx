import React, { useState } from 'react';
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
  const [formData, setFormData] = useState({ //état local pour stocker les données du formulaire, formDate est un objet avec 3 propriétés et leur valeur initiale, setformdate est une fonction qui permet de mettre à jour les données du formulaire
    fullName: '', // etats initiaux de nos champs de formulaire
    email: '',
    role: '',
  });

  const handleChange = (e) => { // mise a jour des données du formulaire
    const { name, value } = e.target; // on récupère le nom et la valeur de l'input
    setFormData({// on met à jour les données du formulaire
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('Création de l\'utilisateur :', formData);
      const response = await fetch('http://localhost:5001/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const user = await response.json();
        console.log('Utilisateur créé :', user);
        alert('Inscription réussie !');
      } else {
        console.error('Erreur lors de l\'inscription :', response.statusText);
        alert('Erreur lors de l\'inscription.', response.statusText);
      }
    } catch (error) {
      console.error('Erreur réseau :', error);
      alert('Erreur réseau. Veuillez vérifier votre connexion.');
    }
  };

  return (
    <SignupSection id="register">
      <h2>Rejoignez-nous</h2>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="fullName"
          placeholder="Nom complet"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <Input
          type="email"
          name="email"
          placeholder="Email académique"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
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
