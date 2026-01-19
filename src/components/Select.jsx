const SelectField = ({ id, value, options, placeholder, onSelect }) => {

    return ( 
        <section role="dropdown">

            <select id={id} defaultValue={value} onChange={(e) => onSelect(e.target.value)} list={id}>   
                <option value="">{placeholder}</option>
                {options.map((val) => 
                    
                    <option key={val} value={val} >{val}</option>
                )}
            </select>

        </section>
     );
}
 
export default SelectField;