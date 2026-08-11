const FilterCommission = ({ styles, returnCommissionsByIsDeIngreso, handleIsDeIngreso, handleSelectedCommission }) => {
	return (
		<div className={styles.containerSelectComision}>
			<div className={styles.deIngreso}>
				<span>De ingreso</span> <input type="checkbox" onChange={handleIsDeIngreso} />
				<p className={styles.infoText}>
					 Marcar esta opción aplicará los cambios a la <b>Comisión de Ingreso y Promoción</b>.  
					 Si no se marca, aplicará a la <b>Comisión Dictaminadora</b>.
				</p>
			</div>

			<select name="comisiones" id="comisiones" defaultValue="" onChange={handleSelectedCommission}>
				<option value="" disabled>Seleccione una comisión</option>
				{
					returnCommissionsByIsDeIngreso().map((item) => (
						<option key={item.id} value={item.id}>{item.siglas}</option>
					))
				}
			</select>
		</div>
	);
};


export default FilterCommission;