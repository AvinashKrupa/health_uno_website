import { Row, Col} from "react-bootstrap";
import {API, get} from '../../api/config/APIController';
import { useEffect } from "react";
import {useToasts} from 'react-toast-notifications';
import { useState } from "react";
import {Link} from 'react-router-dom';
import useSearchStore from './../store/searchStore';
import SpecialityCard from "../commonComponentPatient/SpecialityCard";
import SearchInputWithIcon from '../../commonComponent/SearchInputWithIcon';


const Specialities = (props) => {
  const { addToast } = useToasts();
  const setSearchTextInStore = useSearchStore(state => state.setSearchText);
  let [searchText, setSearchText] = useState('');
  const [specialities, setSpecialities] = useState([]);

  useEffect(() => {
    getSpecialization();
  }, []);

  function getSpecialization() {
    get(API.GETSPECIALITIES)
      .then(response => {
        if (response.status === 200) {
          setSpecialities(response.data.data);
        } else {
          addToast(response.data.message, { appearance: 'error' });
        }
      })
      .catch(error => {
        addToast(error.response.data.message, { appearance: 'error' });
      });
  }


  function handleSearch(txt) {
    setSearchText(txt);
  }

  function redirectToTopConsultants(txt) {
    setSearchTextInStore(txt);
    props.history.push("/patient/topConsultants");
  }

  function getSpecializationList() {

    const filteredList = searchText !== '' ? specialities.filter((post) => {
      return post.title.toLowerCase().includes(searchText.toLowerCase()) ? post : null
    }) : specialities;


    return filteredList.map((specialitie) => {
      return (
        <SpecialityCard
          icon={specialitie.image}
          label={specialitie.title}
          setSearchText={redirectToTopConsultants}
        />
      );
    })
  }


  return (
    <div>
      <Row className='top-consultants-container'>
        <Col lg="1" sm="1" xs='1' />
        <Col lg="10" sm="10" xs='10'>
          <Row className='back-navigation'>
            <Link to='/patient/home'><i class="fas fa-arrow-left"></i><span>Specialities</span></Link>
          </Row>
          <Row className='search-container'>
            <SearchInputWithIcon
              placeholder="Search doctors"
              className='patient-homepage-search'
              onChange={(e) => handleSearch(e)}
            >
            </SearchInputWithIcon>
          </Row>
          <Row style={{ marginTop: "42px", marginBottom: "32px" }}>
            <Col>
              <span className="patient-homepage-text-h4">Specialities</span>
            </Col>
            <Col style={{ textAlign: "right" }}>
              <span className="patient-homepage-link-text ">View All</span>
            </Col>
          </Row>
          <Row>
            { getSpecializationList() }
          </Row>
        </Col>
        <Col lg="1" sm="1" xs='1'/>
      </Row>
    </div>
  );
};

export default Specialities;  
