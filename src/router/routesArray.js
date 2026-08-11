import { LlenarSolicitudPage } from "../features/academico/llenarSolicitud/index.js";
import { AdministracionPage } from "../features/administracion/pages/AdministracionPage";
import { AdministradorConvocatoriaPage } from "../features/administradorConvocatoria/pages/AdministradorConvocatoriaPage.jsx";
import { AdministradorSitio } from "../features/administradorSitio/pages/AdministradorSitio.jsx";
import { ComisionDictaminadoraAgPage } from "../features/comision/dictaminadoraAg/pages/ComisionDictaminadoraAgPage.jsx";
import { ComisionDictaminadoraSemsPage } from "../features/comision/dictaminadoraSems/index.js";
import { ContralorCuSemsPage } from "../features/contralor/contralorCuSems/index.js";
import { ContralorGralPage } from "../features/contralor/contralorGeneral/pages/ContralorGralPage.jsx";
import SecretarioContralorPage from "../features/contralorSecretario/pages/SecretarioContralorPage.jsx";
import { HackAcademicoPage } from "../features/hackAcademico/pages/HackAcademicoPage.jsx";
import { InconformidadPage } from "../features/inconformidad";
import { JefeDepartamentoPage } from "../features/jefe_departamento";
import { SecretariaAdminCuPage } from "../features/secretaria/secretariaAdminCu/pages/SecretariaAdminCuPage.jsx";
import { SecretariaAdminSemsPage } from "../features/secretaria/secretariaAdminSems/pages/SecretariaAdminSemsPage.jsx";
import { SecretariaPreparatoriaPage } from "../features/secretaria/secretariaPreparatoria/pages/SecretariaPreparatoriaPage.jsx";

export const routesMap = [
  {
    path: "/llenar-solicitud",
    component: LlenarSolicitudPage,
    roles: ["academico"],
  },
  {
    path: "/administrador_sitio",
    component: AdministradorSitio,
    roles: ["admin_gral"],
  },
  {
    path: "/administracion",
    component: AdministracionPage,
    roles: ["comision_dictaminadora_cu_ep"],
  },
  {
    path: "/jefe_departamento",
    component: JefeDepartamentoPage,
    roles: ["jefe_depto"],
  },
  {
    path: "/administrador-convocatoria",
    component: AdministradorConvocatoriaPage,
    roles: ["admin_convocatoria"],
  },
  {
    path: "/secretaria_escuelas_preparatorias",
    component: SecretariaPreparatoriaPage,
    roles: ["secretaria_escuelas_preparatorias"],
  },
  {
    path: "/secretaria_admin_cu",
    component: SecretariaAdminCuPage,
    roles: ["secretaria_admin_cu"],
  },
  {
    path: "/secretaria_admin_sems",
    component: SecretariaAdminSemsPage,
    roles: ["secretaria_admin_sems"],
  },
  {
    path: "/comision_especial_dictaminadora_ag",
    component: ComisionDictaminadoraAgPage,
    roles: ["comision_especial_dictaminadora_ag"],
  },
  {
    path: "/comision_especial_dictaminadora_sems",
    component: ComisionDictaminadoraSemsPage,
    roles: ["comision_especial_dictaminadora_sems"],
  },
  {
    path: "/comision_ingreso_promocion_personal_academico_sems",
    component: InconformidadPage,
    roles: ["comision_ingreso_promocion_personal_academico_sems"],
  },
  {
    path: "/comision_ingreso_promocion_personal_academico_cu_ep",
    component: InconformidadPage,
    roles: ["comision_ingreso_promocion_personal_academico_cu_ep"],
  },
  {
    path: "/comision_ingreso_promocion_personal_academico_h_cgu",
    component: InconformidadPage,
    roles: ["comision_ingreso_promocion_personal_academico_h_cgu"],
  },
  {
    path: "/contralor_cu_sems",
    component: ContralorCuSemsPage,
    roles: ["contralor_cu_sems"],
  },
  {
    path: "/contralor_gral",
    component: ContralorGralPage,
    roles: ["contralor_gral"],
  },
  {
    path: "/hack_academico",
    component: HackAcademicoPage,
    roles: ["hack_academico"],
  },
  {
    path: "/contralor_secretario_cgai",
    component: SecretarioContralorPage,
    roles: ["contralor_secretario_cgai"],
  },
];

