import { Row, Col, Button, InputGroup, Image } from "react-bootstrap";
import CheckboxList from "../../../commonComponent/CheckboxList";
import {minus} from '../../../constants/PatientImages';
import InputRange from "react-input-range";
import {API, get} from '../../../api/config/APIController';
import { useEffect, useState } from "react";
import { useToasts } from 'react-toast-notifications';
import "react-input-range/lib/css/index.css";
import CustomButton from '../../../commonComponent/Button'

let isDefaultSet = true;

const FilterConsultants = (props) => {

    useEffect(() => {
        getLanguage()
        return () => {};
    }, []);

    const { addToast } = useToasts();
    let [minMax, setMinMax] = useState({ min: 100, max: 1000 });
    const [showLanguages, setShowLanguages] = useState(true);
    const [languages, setLanguages] = useState([]);
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [sortBy, setSortBy] = useState('asc');
   
    function getLanguage() {
        get(API.GETLANGUAGE)
        .then(response => {
            if (response.status === 200) {
            let data = response.data.data.map(info => {
                return info.name;
            });
            setLanguages(data);
            } else {
            addToast(response.data.message, { appearance: 'error' });
            }
        })
        .catch(error => {
            addToast(error.data.message, { appearance: 'error' });
        });
    }

     function handleLanguageGroup(language) {
        isDefaultSet = false;
        let list = JSON.parse(JSON.stringify(selectedLanguages))
        const isPresent = list.includes(language);

        if (isPresent) {
            const index = list.indexOf(language);
            list.splice(index, 1);

        } else {
            list.push(language);
        }
        setSelectedLanguages(list);
    }

    function toggleLanguages() {
        setShowLanguages(!showLanguages);
    };

    function setDefaultValue(e) {
        isDefaultSet = true;
        setSelectedLanguages([]);
        setShowLanguages(false);
        setMinMax({ min: 100, max: 1000 });
        setSortBy('');
    }

    function filter() {
        const min = !isDefaultSet ? minMax.min : '';
        const max = !isDefaultSet ? minMax.max : '' ;
        props.callBackFilter({min, max, selectedLanguages, sortBy});
        props.toggleSidebar()
    }

  return (
    <>
      <Row className="filter_menu_continer">
        <Col style={{ paddingLeft: "26px", paddingRight: "16px" }}>
          <Row style={{ marginTop: "40px" }} className='filter-close'>
            <span
              style={{
                height: "12px",
                width: "12px",
                paddingLeft: "290px",
                cursor: 'pointer'
              }}
              onClick={props.toggleSidebar}
            >
              <i class="fas fa-times"></i>
            </span>
          </Row>
          <Row style={{ marginTop: "13px", display: 'flex',
                justifyContent: 'space-around'}}>
            <div
              className="filter_menu_h4"
              style={{ paddingLeft: "16px", paddingTop: "33px",  marginBottom: '16px',cursor: 'pointer'}}
            >
              Filter
            </div>
          </Row>
          <Row style={{ marginTop: "15.5px" }}>
            <hr className="rounded"></hr>
          </Row>
          <Row >
            <span
              className="filter_menu_h4"
              style={{ paddingLeft: "16px"}}
            >
              Sort By
            </span>
          </Row>
          <Row style={{ marginTop: "16px " }}>
            <InputGroup style={{ marginTop: "16px " }}>
              <Button
                value={'asc'}
                className="filter_menu_button"
                style={{ marginLeft: "18px", backgroundColor: sortBy === 'asc' ? '#28A3DA' : ''  }}
                onClick={(e) => { 
                    isDefaultSet = false
                    setSortBy(e.target.value)
                }}
              >
                A-Z
              </Button>
              <Button
                value={'desc'}
                className="filter_menu_button"
                style={{ marginLeft: "18px",  backgroundColor: sortBy === 'desc' ? '#28A3DA' : '' }}
                onClick={(e) => { 
                    isDefaultSet = false
                    setSortBy(e.target.value)
                }}
              >
                Z-A
              </Button>
            </InputGroup>
          </Row>
          <Row>
            <span
              className="filter_menu_h4"
              style={{ paddingLeft: "16px", paddingTop: "27px" }}
            >
              Consultation Fees
            </span>
            <InputRange
              step={100}
              className="filter_menu_inputrange"
              minValue={100}
              maxValue={5000}
              value={minMax}
              onChange={(value) => {
                isDefaultSet = false
                setMinMax(value)}
              }
              formatLabel={(value) => `₹ ${value}`}
              onChangeComplete={null}
            />
          </Row>
          <Row style={{ marginTop: "33px" }}>
            <span
              className="filter_menu_h4"
              style={{ paddingLeft: "16px", paddingTop: "25px" }}
            >
              Language
            </span>
            <span style={{ cursor: 'pointer', paddingLeft: "144px" }}>
              <Image
                src={minus}
                className="filter_menu_image"
                onClick={toggleLanguages}
              />
            </span>
            {showLanguages ? (
                <div
                  className="filter_menu_scrollable_div"
                >
                  <CheckboxList onClick={handleLanguageGroup} list={languages} />
                </div>
            ) : null}
          </Row>

          <div >
            <CustomButton
              className="filter_menu_h5"
              onClick={(e) => filter()}
              text={'Apply'}
            ></CustomButton>
             <CustomButton
              className="filter_menu_h5"
              onClick={(e) =>  setDefaultValue()}
              text={'Clear'}
            ></CustomButton>
          </div>
        </Col>
      </Row>
    </>
  );
};
export default FilterConsultants;