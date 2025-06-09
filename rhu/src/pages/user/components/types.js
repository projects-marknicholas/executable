const Types = ({ selectedType, setSelectedType }) => {
  return (
    <div className='reg-radio'>
      <label htmlFor='individual'>
        <input
          type='radio'
          id='individual'
          name='type'
          value='Individual'
          checked={selectedType === 'Individual'}
          onChange={(e) => setSelectedType(e.target.value)}
        />
        <span>Individual</span>
      </label>
      <label htmlFor='family'>
        <input
          type='radio'
          id='family'
          name='type'
          value='Family'
          checked={selectedType === 'Family'}
          onChange={(e) => setSelectedType(e.target.value)}
        />
        <span>Family</span>
      </label>
      <label htmlFor='institution'>
        <input
          type='radio'
          id='institution'
          name='type'
          value='Institution'
          checked={selectedType === 'Institution'}
          onChange={(e) => setSelectedType(e.target.value)}
        />
        <span>Institution</span>
      </label>
    </div>
  );
};

export default Types;
