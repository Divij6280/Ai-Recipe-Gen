import React, { useState } from 'react';
import axios from 'axios';

const IngredientInput = ({ ingredients, setIngredients, handleGenerate }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch ingredient suggestions as user types
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setInput(value);

    if (value.trim()) {
      setLoading(true); // Start loading when typing
      try {
        const response = await axios.post('http://localhost:5000/api/recipes/suggestions', {
          value
        });
        setSuggestions(response.data?.ingredients);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false); // End loading after request
      }
    } else {
      setSuggestions([]);
      setLoading(false); // Clear loading if input is empty
    }
  };

  // Add ingredient to the list
  const handleAddIngredient = (ingredient) => {
    if (!ingredients.includes(ingredient)) {
      setIngredients([...ingredients, ingredient]);
    }
    setInput(''); // Clear input field
    setSuggestions([]); // Clear suggestions
  };

  // Handle keypress for adding ingredient
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      handleAddIngredient(input.trim());
    }
  };

  // Remove ingredient from the list
  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  return (
    <div className="ingredient-input modern-card">
      <h3 className="input-title">Add Ingredients</h3>
      <div className="input-container">
        <input
          type="text"
          placeholder="Type an ingredient"
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          list="ingredient-suggestions"
          className="ingredient-input-field"
        />
        <button onClick={() => handleAddIngredient(input)} className="add-button">
          Add
        </button>
      </div>

      {/* Loading indicator */}
      {loading && <div className="loading-spinner">Loading...</div>}

      {/* Datalist for autocomplete */}
      <datalist id="ingredient-suggestions">
        {suggestions.map((ingredient, index) => (
          <option key={index} value={ingredient} />
        ))}
      </datalist>

      <div className="ingredient-list">
        {ingredients?.map((ingredient, index) => (
          <div key={index} className="ingredient-tag">
            <div>{ingredient}</div>
            <button onClick={() => removeIngredient(index)} className="remove-button">
              &times;
            </button>
          </div>
        ))}
      </div>

      <button onClick={handleGenerate} className="generate-button">
        Generate Recipe
      </button>
    </div>
  );
};

export default IngredientInput;