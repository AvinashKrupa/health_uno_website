import React from 'react';
import Autosuggest from 'react-autosuggest';
class AutoSuggestInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            suggestions: []
        };
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
        this.setState({
            suggestions: this.props.getSuggestions(value)
        }, ()=> console.log('suggestions :', this.state.suggestions));
    };

    // Triggered on clear
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    onSelectResult = (e, { suggestion }) => {
        debugger
        this.props.selectMedicineName(suggestion)
    }

    render() {
        const { value, suggestions } = this.state;

        const inputProps = {
            placeholder: 'Enter Medicine Name',
            value,
            onChange: this.onChange
        };

        return (
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
        );
    }
}

export default AutoSuggestInput;
