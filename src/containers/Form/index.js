import { useCallback, useState } from "react"; 
import PropTypes from "prop-types"; 
import Field, { FIELD_TYPES } from "../../components/Field"; 
import Select from "../../components/Select"; 
import Button, { BUTTON_TYPES } from "../../components/Button"; 

// Simulation d'une API de contact pour l'envoi des données (fonction mock)
const mockContactApi = (data) => 
  new Promise((resolve) => {
    console.log("Données envoyées :", data); // Affichage des données envoyées dans la console pour vérification
    setTimeout(resolve, 500); // Simulation d'une API qui prend 500 ms pour répondre
  });

// Le formulaire de contact
const Form = ({ onSuccess, onError }) => {
  // États locaux pour la gestion de l'envoi et des données du formulaire
  const [sending, setSending] = useState(false); // 'sending' indique si l'envoi est en cours
  const [formData, setFormData] = useState({ // 'formData' contient les données du formulaire
    nom: "",
    prenom: "",
    type: "",
    email: "",
    message: "",
  });

  // Fonction pour mettre à jour les champs du formulaire
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value })); // Mise à jour de l'état du formulaire avec les nouvelles valeurs
  };

  // Fonction pour envoyer le formulaire, elle est encapsulée dans 'useCallback' pour éviter sa recréation à chaque render
  const sendContact = useCallback(
    async (evt) => {
      evt.preventDefault(); // Empêche le comportement par défaut du formulaire (rechargement de la page)
      setSending(true); // Indique que l'envoi est en cours (affichage du bouton "En cours")
       // We try to call mockContactApi
      try {
        // Envoi des données via l'API mock
        await mockContactApi(formData);
        setSending(false); // L'envoi est terminé
        // Correction : Ajout de onSuccess(true)
        onSuccess(true); // Appel de la fonction de succès passée en props
      } catch (err) {
        setSending(false); // L'envoi a échoué
        onError(err); // Appel de la fonction de gestion d'erreur passée en props
      }
    },
    [formData, onSuccess, onError] // 'useCallback' dépend de formData, onSuccess et onError
  );

  return (
    <form onSubmit={sendContact}> {/* Lors de l'envoi du formulaire, la fonction sendContact est appelée */}
      <div className="row">
        <div className="col">
          {/* Champ pour le "Nom" */}
          <Field
            placeholder=""
            label="Nom"
            value={formData.nom}
            onChange={(e) => handleChange("nom", e.target.value)} // Mise à jour de la valeur du "Nom"
          />
          {/* Champ pour le "Prénom" */}
          <Field
            placeholder=""
            label="Prénom"
            value={formData.prenom}
            onChange={(e) => handleChange("prenom", e.target.value)} // Mise à jour de la valeur du "Prénom"
          />
          {/* Sélecteur pour choisir entre "Personel" et "Entreprise" */}
          <Select
          // Correction : Orthographe personnel
            selection={["Personnel", "Entreprise"]} // Liste des options
            onChange={(value) => handleChange("type", value)} // Mise à jour de la valeur du "type"
            label="Personnel / Entreprise" // Libellé du champ
            type="large" // Type du select (peut être utilisé pour la taille, style...)
            titleEmpty // Peut être utilisé pour afficher un titre vide ou placeholder
          />
          {/* Champ pour l'email */}
          <Field
            placeholder=""
            label="Email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)} // Mise à jour de la valeur de l'email
          />
          {/* Bouton d'envoi */}
          <Button type={BUTTON_TYPES.SUBMIT} disabled={sending}>
            {sending ? "En cours" : "Envoyer"}
          </Button>
        </div>
        <div className="col">
          {/* Champ pour le message, de type TEXTAREA */}
          <Field
            placeholder="message"
            label="Message"
            type={FIELD_TYPES.TEXTAREA} // Indique que ce champ est un textarea
            value={formData.message}
            onChange={(e) => handleChange("message", e.target.value)} 
          />
        </div>
      </div>
    </form>
  );
};


Form.propTypes = {
  onError: PropTypes.func, 
  onSuccess: PropTypes.func, 
};


Form.defaultProps = {
  onError: () => null, 
  onSuccess: () => null, 
};

export default Form;

