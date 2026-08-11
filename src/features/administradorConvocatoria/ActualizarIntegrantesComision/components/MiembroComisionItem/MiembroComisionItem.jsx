import { MdOutlineDeleteOutline } from "react-icons/md";
import { useContextUpdateMembers } from "../../hooks/useContextUpdateMembers";

const MiembroComisionItem = ({ styles, positions, member }) => {
	const { removeMember } = useContextUpdateMembers();

	const getPosition = () => {
		const positionByMember = positions.find((item) => item.id === member.idCargo);
		return positionByMember;
	}

	return (
		<tr>
			<td>{getPosition()?.descripcion || ""}</td>
			<td>{member?.tratamiento}</td>
			<td>{member?.nombre}</td>
			<td>{member?.codigo}</td>
			<td>{member?.departamento}</td>
			<td className={styles.actionColumn}>
				<button className={styles.deleteButton} onClick={() => removeMember(member.codigo)}>
					<MdOutlineDeleteOutline size={22} />
				</button>
			</td>
		</tr>
	);
};


export default MiembroComisionItem;