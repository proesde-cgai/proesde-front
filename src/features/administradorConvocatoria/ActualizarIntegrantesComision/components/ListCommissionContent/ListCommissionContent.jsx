import { useEffect } from "react";
import MiembroComisionItem from "../MiembroComisionItem/MiembroComisionItem";
import TextStatus from '../TextStatus/TextStatus'
import { Spinner } from "../spinner";

const ListCommissionContent = ({
	styles,
	members,
	positions,
	toggleModal,
	visible,
	handleNewList,
	guardarMembers,
	statusResponse,
	getCopyMembersCommissions,
	infoCommission,
	resetMembersToInitial,
}) => {
	const membersActivos = members.filter((item) => item.activo === true);
	

	if (members.length <= 0 && !visible) {
		return (
			<div className={styles.containerWarning}>
				<TextStatus
					error={statusResponse.error}
					message={statusResponse.message}
					styles={styles}
				/>
				<p className={styles.textWarning}>
					Desea hacer una copia de el año anterior o crear una nueva?
				</p>

				<button onClick={getCopyMembersCommissions}>Hacer una copia</button>
				<button onClick={handleNewList}>Crear una nueva</button>
			</div>
		)
	}

	// console.log("Member list from service Lista comision", members);
	// console.log("Active member list Lista comision", membersActivos);

	return (
		<div className={styles.containerManagement}>
			<TextStatus
				error={statusResponse.error}
				message={statusResponse.message}
				styles={styles}
			/>
			<p className={styles.textTableCommissions}>Cambie los valores que desee actualizar y después asegúrese de oprimir el botón de "Guardar"</p>

			<h3 className={styles.title}>Lista de miembros de comisión</h3>
			<p className={styles.subtitle}>Total de miembros: {membersActivos.length}</p>
			<p className={styles.commission}>{`${infoCommission()?.aliasRol || ""}, ${infoCommission()?.siglas || ''}`}:</p>

			<table className={styles.customTable}>
				<thead>
					<tr>
						<th>Cargo</th>
						<th>Trato</th>
						<th>Nombre</th>
						<th>Código</th>
						<th>Departamento</th>
						<th>Acción</th>
					</tr>
				</thead>
				<tbody>
					{membersActivos.map((item) => (
						<MiembroComisionItem styles={styles} member={item} positions={positions} key={item.codigo} />
					))}
				</tbody>
			</table>

			<div className={styles.buttonGroup}>
				<button className={styles.addButton} onClick={toggleModal} disabled={statusResponse?.loading}>Agregar</button>
				<button className={styles.cancelButton} onClick={resetMembersToInitial}>Cancelar</button>
				<button className={styles.saveButton} onClick={guardarMembers} disabled={statusResponse?.loading}>
					{statusResponse.loading ? <Spinner /> : 'Guardar'}
				</button>
			</div>
		</div>
	);
};


export default ListCommissionContent;