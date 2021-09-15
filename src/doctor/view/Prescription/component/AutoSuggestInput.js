import React from 'react';
import Autosuggest from 'react-autosuggest';
class AutoSuggestInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            suggestions: [],
            noSuggestions: false
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.resetValue && this.props.shouldResetValue){
            this.setState({
                value:'',
                suggestions: [],
            },()=> {
                this.props.setShouldResetValue(false)
                this.props.setSelectedSectionIndex(null)
            })
        }
        if(this.props.shouldClearInput){
            this.setState({
                value:'',
                suggestions: [],
            },()=> {
                this.props.setShouldClearInput(false)
            })
        }
    }

    getSuggestionValue = suggestion => suggestion.name;

    renderSuggestion = suggestion => (
        <div>
            {suggestion.name}
        </div>
    );

    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        });
    };

    // Suggestion rerender when user types
    onSuggestionsFetchRequested = ({ value }) => {
        this.props.getSuggestions(value)
            .then(response => {
                const isInputBlank = value.trim() === '';
                const noSuggestions = !isInputBlank && response?.data?.data?.length === 0;
                if (response.status === 200) {
                    this.setState({
                        suggestions: response.data.data,
                        noSuggestions
                    });
                } else {
                    this.setState({
                        suggestions: [],
                        noSuggestions
                    });
                }
            })


        this.setState({
            suggestions: this.props.getSuggestions(value)
        });
    };

    // Triggered on clear
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    onSelectResult = (e, { suggestion }) => {
        this.props.selectMedicineName(suggestion)
    }

    render() {
        const { value, suggestions,noSuggestions } = this.state;

        const inputProps = {
            placeholder: 'Enter Medicine Name',
            value,
            onChange: this.onChange
        };

        return (
            <>
                <Autosuggest
                    className="form-control"
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={this.renderSuggestion}
                    inputProps={inputProps}
                    onSuggestionSelected={this.onSelectResult}
                />
                {
                    noSuggestions &&
                    <div className="no-suggestions">
                        No suggestions found
                    </div>
                }
            </>
        );
    }
}

export default AutoSuggestInput;

