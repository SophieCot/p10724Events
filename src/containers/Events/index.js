import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();

  // Log pour vérifier la structure des données reçues
  console.log("Données reçues :", data);

  const [type, setType] = useState(null); // Initialisation à null
  const [currentPage, setCurrentPage] = useState(1);

  // Liste des types d'événements uniques
  const typeList = Array.from(new Set(data?.events?.map((event) => event.type) || []));
  console.log("Liste des types d'événements :", typeList); // Log de la liste des types

  // Gestion du changement de type
  const changeType = (evtType) => {
    console.log(`Nouveau type sélectionné : ${evtType}`); // Log du type sélectionné
    setCurrentPage(1); // Remise à zéro de la page
    setType(evtType || null); // Si evtType est null, on remet à null
  };

  // Filtrage des événements
  const filteredEvents = (data?.events || []).filter((event) => {
    console.log(`Filtrage - Type sélectionné : ${type}, Type de l'événement : ${event.type}`); // Log de filtrage
    return type === null || event.type === type; // Si type est null, on montre tous les événements
  });

  console.log("Événements après filtrage :", filteredEvents); // Log des événements filtrés

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / PER_PAGE); // Calcul du nombre total de pages
  console.log("Total des pages :", totalPages); // Log du nombre total de pages

  const paginatedEvents = filteredEvents.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE); // Découper les événements par page

  return (
    <>
      {error && <div>Une erreur est survenue</div>} {/* Affichage d'une erreur en cas de problème */}
      {data === null ? (
        "Chargement..." // Affichage pendant le chargement des données
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={typeList}
            onChange={(value) => changeType(value)} // Envoi du changement de type à la fonction
          />
          <div id="events" className="ListContainer">
            {paginatedEvents.length > 0 ? (
              paginatedEvents.map((event) => (
                <Modal key={event.id} Content={<ModalEvent event={event} />}>
                  {({ setIsOpened }) => (
                    <EventCard
                      onClick={() => setIsOpened(true)}
                      imageSrc={event.cover || "path/to/default/image.jpg"} // Image par défaut si l'image est manquante
                      title={event.title}
                      date={new Date(event.date)} // Formatage de la date
                      label={event.type}
                    />
                  )}
                </Modal>
              ))
            ) : (
              <div className="NoEvents">Aucun événement trouvé pour cette catégorie.</div> // Message si aucun événement trouvé
            )}
          </div>
          <div className="Pagination">
            {[...Array(totalPages)].map((_, n) => (
              <a
                key={`page-${n + 1}`}
                href="#events"
                onClick={() => setCurrentPage(n + 1)} // Permet de naviguer entre les pages
              >
                {n + 1} {/* Affiche le numéro de la page */}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;




