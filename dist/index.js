import { Loading as L, QSpinnerRings as oe, QCard as le, QCardSection as K, QBanner as ae, QInput as G, QIcon as H, QBtn as S, QTooltip as q, QTable as ne, QTd as J, QToggle as ie, QSelect as O, Quasar as de } from "quasar";
import { ref as Q, watch as M, watchEffect as se, onBeforeUnmount as re, computed as W, createBlock as g, openBlock as s, unref as t, withCtx as c, createVNode as V, createElementVNode as ue, toDisplayString as B, createCommentVNode as T, renderSlot as ce, withKeys as me, createTextVNode as _, createSlots as fe, createElementBlock as v, Fragment as E, renderList as te, normalizeStyle as ge } from "vue";
function pe(o, y) {
  const l = Q([...o.modelValue]);
  M(() => o.modelValue, (e) => {
    l.value = [...e];
  });
  let b = !1;
  se(() => {
    o.loading ? b || (b = !0, setTimeout(() => {
      L.show({ spinner: oe });
    }, 0)) : b && (b = !1, L.hide());
  }), re(() => {
    L.hide();
  });
  const u = Q(/* @__PURE__ */ new Set()), h = (e) => u.value.has(e), N = W(() => u.value.size > 0), U = () => {
    var p;
    if (o.useExternalAdd) {
      y("add");
      return;
    }
    if (N.value) {
      (p = o.confirmError) == null || p.call(o, "Termine a edição atual antes de criar um novo registo.");
      return;
    }
    const e = {
      _isNew: !0,
      lifeCycleStatus: "ACTIVE"
    };
    o.columns.forEach((m) => {
      m.field !== "actions" && m.field !== "lifeCycleStatus" && (e[m.field] = "");
    }), l.value.push(e), u.value.add(e), y("update:modelValue", [...l.value]);
  }, A = (e) => {
    var p, m, C, n, f, I;
    if (o.useExternalEdit) {
      y("edit", e);
      return;
    }
    if (N.value) {
      (p = o.confirmError) == null || p.call(o, "Termine a edição atual antes de editar outro registo.");
      return;
    }
    e._backup = { ...e }, e.programId = ((m = e.program) == null ? void 0 : m.id) ?? null, e.serviceId = ((C = e.service) == null ? void 0 : C.id) ?? null, e.provinceId = ((f = (n = e.district) == null ? void 0 : n.province) == null ? void 0 : f.id) ?? null, e.districtId = ((I = e.district) == null ? void 0 : I.id) ?? null, u.value.add(e);
  }, x = (e) => {
    e._isNew ? (l.value = l.value.filter((p) => p !== e), u.value.delete(e), y("update:modelValue", [...l.value])) : (e._backup && (Object.assign(e, e._backup), delete e._backup), delete e.programId, u.value.delete(e));
  }, R = async (e) => {
    var C;
    const m = $.value.map((n) => n.field).filter((n) => n !== "lifeCycleStatus" && n !== "actions").find((n) => {
      const f = e[n];
      return f == null || f === "";
    });
    if (m) {
      const n = o.columns.find((I) => I.field === m), f = (n == null ? void 0 : n.label) || m;
      (C = o.confirmError) == null || C.call(o, `O campo "${f}" é obrigatório.`);
      return;
    }
    try {
      const n = await new Promise((f, I) => {
        y("save", e, { resolve: f, reject: I });
      });
      n != null && n.program && (e.program = n.program), n != null && n.service && (e.service = n.service), delete e.programId, delete e.serviceId, delete e._backup, u.value.delete(e), y("update:modelValue", [...l.value]);
    } catch (n) {
      console.error("Erro ao salvar a linha:", n);
    }
  }, D = async (e) => {
    var p, m;
    if (u.value.size > 0 && !h(e)) {
      (p = o.confirmError) == null || p.call(o, "Termine a edição atual antes de apagar outro registo.");
      return;
    }
    try {
      if (!await ((m = o.confirmDelete) == null ? void 0 : m.call(
        o,
        "Deseja realmente apagar este registo? Esta ação não poderá ser desfeita."
      ))) return;
      await new Promise((n, f) => {
        y("delete", e, { resolve: n, reject: f });
      }), l.value = l.value.filter((n) => n !== e), u.value.delete(e), y("update:modelValue", [...l.value]);
    } catch (C) {
      console.error("Erro ao apagar a linha:", C);
    }
  }, F = (e) => {
    y("search", e.trim());
  }, z = (e) => {
    y("toggle-status", e);
  }, $ = W(
    () => o.columns.filter((e) => e.name !== "actions")
  );
  return {
    rows: l,
    editingRows: u,
    isEditing: h,
    isEditingAnyRow: N,
    addRow: U,
    editRow: A,
    cancelEdit: x,
    saveRow: R,
    deleteRow: D,
    search: F,
    toggleStatus: z,
    visibleColumns: $
  };
}
const ye = { class: "text-subtitle2 text-primary" }, ve = { key: 0 }, be = {
  key: 1,
  class: "q-gutter-sm"
}, ke = {
  __name: "EditableTable",
  props: {
    title: String,
    modelValue: Array,
    columns: Array,
    programOptions: Array,
    serviceOptions: Array,
    programActivityOptions: Array,
    provinceOptions: Array,
    districtOptions: Array,
    loading: Boolean,
    pagination: Object,
    rowsPerPageOptions: Array,
    confirmError: Function,
    confirmDelete: Function,
    useExternalAdd: Boolean,
    useExternalEdit: Boolean,
    hideDelete: { type: Boolean, default: !1 },
    hideEdit: { type: Boolean, default: !1 },
    hideToggleStatus: { type: Boolean, default: !1 },
    hideSearchInput: { type: Boolean, default: !1 },
    hideSearchButton: { type: Boolean, default: !1 },
    hideAddButton: { type: Boolean, default: !1 },
    extraActions: {
      type: Array,
      default: () => []
    }
  },
  emits: [
    "update:modelValue",
    "save",
    "delete",
    "search",
    "toggle-status",
    "request",
    "add",
    "edit",
    "extra-action",
    "custom-action"
  ],
  setup(o, { emit: y }) {
    var n, f, I, X, Y;
    const l = o, b = Q(""), u = y, h = Q({
      sortBy: ((n = l.pagination) == null ? void 0 : n.sortBy) ?? "id",
      descending: ((f = l.pagination) == null ? void 0 : f.descending) ?? !1,
      page: ((I = l.pagination) == null ? void 0 : I.page) ?? 1,
      rowsPerPage: ((X = l.pagination) == null ? void 0 : X.rowsPerPage) ?? 10,
      rowsNumber: ((Y = l.pagination) == null ? void 0 : Y.rowsNumber) ?? 0
    }), N = W(() => (d) => l.extraActions.filter((r) => typeof r.visible == "function" ? r.visible(d) : r.visible !== !1));
    M(() => l.pagination, (d) => {
      h.value = {
        sortBy: (d == null ? void 0 : d.sortBy) ?? "id",
        descending: (d == null ? void 0 : d.descending) ?? !1,
        page: (d == null ? void 0 : d.page) ?? 1,
        rowsPerPage: (d == null ? void 0 : d.rowsPerPage) ?? 10,
        rowsNumber: (d == null ? void 0 : d.rowsNumber) ?? 0
      };
    }), M(() => {
      var d;
      return (d = l.pagination) == null ? void 0 : d.rowsNumber;
    }, (d) => {
      h.value.rowsNumber = d ?? 0;
    });
    const {
      rows: U,
      isEditing: A,
      isEditingAnyRow: x,
      addRow: R,
      editRow: D,
      cancelEdit: F,
      saveRow: z,
      deleteRow: $,
      search: e,
      toggleStatus: p,
      visibleColumns: m
    } = pe(l, u), C = (d) => {
      h.value = {
        ...d.pagination,
        rowsNumber: h.value.rowsNumber
      }, u("request", d);
    };
    return (d, r) => (s(), g(t(le), {
      class: "q-pa-none",
      flat: "",
      bordered: ""
    }, {
      default: c(() => [
        V(t(K), { class: "text-h6 q-pa-none" }, {
          default: c(() => [
            V(t(ae), {
              dense: "",
              "inline-actions": "",
              class: "text-primary bg-grey-3"
            }, {
              action: c(() => [
                l.hideSearchInput ? T("", !0) : (s(), g(t(G), {
                  key: 0,
                  outlined: "",
                  label: "Pesquisar por Nome, descrição, Código",
                  dense: "",
                  style: { width: "300px" },
                  color: "white",
                  modelValue: b.value,
                  "onUpdate:modelValue": r[1] || (r[1] = (i) => b.value = i),
                  onKeyup: r[2] || (r[2] = me((i) => t(e)(b.value), ["enter"])),
                  disable: t(x)
                }, {
                  append: c(() => [
                    b.value ? (s(), g(t(H), {
                      key: 0,
                      name: "close",
                      onClick: r[0] || (r[0] = () => {
                        b.value = "", t(e)("");
                      }),
                      class: "cursor-pointer"
                    })) : T("", !0)
                  ]),
                  _: 1
                }, 8, ["modelValue", "disable"])),
                l.hideSearchButton ? T("", !0) : (s(), g(t(S), {
                  key: 1,
                  outline: "",
                  style: { color: "goldenrod" },
                  dense: "",
                  icon: "search",
                  onClick: r[3] || (r[3] = (i) => t(e)(b.value)),
                  disable: t(x),
                  class: "q-ml-sm"
                }, {
                  default: c(() => [
                    V(t(q), { class: "bg-primary" }, {
                      default: c(() => r[6] || (r[6] = [
                        _("Pesquisar")
                      ])),
                      _: 1,
                      __: [6]
                    })
                  ]),
                  _: 1
                }, 8, ["disable"])),
                l.hideAddButton ? T("", !0) : (s(), g(t(S), {
                  key: 2,
                  outline: "",
                  style: { color: "goldenrod" },
                  dense: "",
                  icon: "add",
                  class: "q-ml-sm",
                  onClick: r[4] || (r[4] = (i) => l.useExternalAdd ? u("add") : t(R)()),
                  disable: t(x)
                }, {
                  default: c(() => [
                    V(t(q), { class: "bg-primary" }, {
                      default: c(() => [
                        _("Criar novos " + B(l.title), 1)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }, 8, ["disable"])),
                ce(d.$slots, "action-buttons")
              ]),
              default: c(() => [
                ue("span", ye, B(l.title), 1)
              ]),
              _: 3
            })
          ]),
          _: 3
        }),
        V(t(K), { class: "q-pa-md" }, {
          default: c(() => [
            V(t(ne), {
              rows: t(U),
              columns: l.columns,
              "row-key": "id",
              flat: "",
              dense: "",
              separator: "horizontal",
              pagination: h.value,
              "onUpdate:pagination": r[5] || (r[5] = (i) => h.value = i),
              "rows-per-page-options": l.rowsPerPageOptions,
              "pagination-label": (i, a, P) => `${i}-${a} de ${P} registros`,
              onRequest: C
            }, fe({
              "body-cell-actions": c(({ row: i }) => [
                V(t(J), { class: "text-center" }, {
                  default: c(() => [
                    t(A)(i) ? (s(), v("div", ve, [
                      V(t(S), {
                        dense: "",
                        flat: "",
                        icon: "check",
                        color: "green",
                        onClick: (a) => t(z)(i)
                      }, null, 8, ["onClick"]),
                      V(t(S), {
                        dense: "",
                        flat: "",
                        icon: "close",
                        color: "orange",
                        onClick: (a) => t(F)(i)
                      }, null, 8, ["onClick"])
                    ])) : (s(), v("div", be, [
                      l.hideToggleStatus ? T("", !0) : (s(), g(t(S), {
                        key: 0,
                        dense: "",
                        flat: "",
                        icon: i.lifeCycleStatus === "ACTIVE" ? "toggle_on" : "toggle_off",
                        color: i.lifeCycleStatus === "ACTIVE" ? "green" : "grey",
                        onClick: (a) => t(p)(i),
                        disable: t(x)
                      }, null, 8, ["icon", "color", "onClick", "disable"])),
                      l.hideEdit ? T("", !0) : (s(), g(t(S), {
                        key: 1,
                        dense: "",
                        flat: "",
                        icon: "edit",
                        color: "primary",
                        onClick: (a) => l.useExternalEdit ? u("edit", i) : t(D)(i)
                      }, null, 8, ["onClick"])),
                      l.hideDelete ? T("", !0) : (s(), g(t(S), {
                        key: 2,
                        dense: "",
                        flat: "",
                        icon: "delete",
                        color: "red",
                        onClick: (a) => t($)(i)
                      }, null, 8, ["onClick"])),
                      (s(!0), v(E, null, te(N.value(i), (a, P) => (s(), g(t(S), {
                        key: P,
                        dense: "",
                        flat: "",
                        icon: a.icon,
                        color: a.color || "primary",
                        onClick: (j) => u(a.emit || "extra-action", i)
                      }, {
                        default: c(() => [
                          V(t(q), { class: "bg-primary" }, {
                            default: c(() => [
                              _(B(a.tooltip), 1)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1032, ["icon", "color", "onClick"]))), 128))
                    ]))
                  ]),
                  _: 2
                }, 1024)
              ]),
              _: 2
            }, [
              te(t(m), (i) => ({
                name: `body-cell-${i.name}`,
                fn: c(({ row: a }) => [
                  V(t(J), {
                    style: ge(i.style)
                  }, {
                    default: c(() => {
                      var P, j, Z, w, ee;
                      return [
                        i.field === "lifeCycleStatus" ? (s(), v(E, { key: 0 }, [
                          t(A)(a) ? (s(), g(t(ie), {
                            key: 0,
                            "model-value": a.lifeCycleStatus === "ACTIVE",
                            "onUpdate:modelValue": (k) => a.lifeCycleStatus = k ? "ACTIVE" : "INACTIVE",
                            color: "primary",
                            dense: "",
                            "keep-color": ""
                          }, null, 8, ["model-value", "onUpdate:modelValue"])) : (s(), g(t(H), {
                            key: 1,
                            name: a.lifeCycleStatus === "ACTIVE" ? "check_circle" : "cancel",
                            color: a.lifeCycleStatus === "ACTIVE" ? "green" : "red"
                          }, null, 8, ["name", "color"]))
                        ], 64)) : i.field === "programId" ? (s(), v(E, { key: 1 }, [
                          t(A)(a) ? (s(), g(t(O), {
                            key: 0,
                            modelValue: a.programId,
                            "onUpdate:modelValue": (k) => a.programId = k,
                            options: l.programOptions,
                            "option-value": "value",
                            "option-label": "label",
                            "emit-value": "",
                            "map-options": "",
                            outlined: "",
                            dense: "",
                            placeholder: "Selecionar programa"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])) : (s(), v(E, { key: 1 }, [
                            _(B(((P = a.program) == null ? void 0 : P.name) || ((j = a.programActivity) == null ? void 0 : j.program.name) || "—"), 1)
                          ], 64))
                        ], 64)) : i.field === "provinceId" ? (s(), v(E, { key: 2 }, [
                          t(A)(a) ? (s(), g(t(O), {
                            key: 0,
                            modelValue: a.provinceId,
                            "onUpdate:modelValue": [(k) => a.provinceId = k, () => a.districtId = null],
                            options: l.provinceOptions,
                            "option-value": "value",
                            "option-label": "label",
                            "emit-value": "",
                            "map-options": "",
                            outlined: "",
                            dense: "",
                            placeholder: "Selecionar província"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])) : (s(), v(E, { key: 1 }, [
                            _(B(((w = (Z = a.district) == null ? void 0 : Z.province) == null ? void 0 : w.designation) || "—"), 1)
                          ], 64))
                        ], 64)) : i.field === "districtId" ? (s(), v(E, { key: 3 }, [
                          t(A)(a) ? (s(), g(t(O), {
                            key: 0,
                            modelValue: a.districtId,
                            "onUpdate:modelValue": (k) => a.districtId = k,
                            options: l.districtOptions.filter((k) => k.provinceId === a.provinceId),
                            "option-value": "value",
                            "option-label": "label",
                            "emit-value": "",
                            "map-options": "",
                            outlined: "",
                            dense: "",
                            placeholder: "Selecionar distrito"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])) : (s(), v(E, { key: 1 }, [
                            _(B(((ee = a.district) == null ? void 0 : ee.description) || "—"), 1)
                          ], 64))
                        ], 64)) : (s(), v(E, { key: 4 }, [
                          t(A)(a) ? (s(), g(t(G), {
                            key: 0,
                            modelValue: a[i.field],
                            "onUpdate:modelValue": (k) => a[i.field] = k,
                            dense: "",
                            outlined: "",
                            placeholder: i.label
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])) : (s(), v(E, { key: 1 }, [
                            _(B(a[i.field]), 1)
                          ], 64))
                        ], 64))
                      ];
                    }),
                    _: 2
                  }, 1032, ["style"])
                ])
              }))
            ]), 1032, ["rows", "columns", "pagination", "rows-per-page-options", "pagination-label"])
          ]),
          _: 1
        })
      ]),
      _: 3
    }));
  }
}, Ee = {
  install(o) {
    o.use(de, {
      components: {
        QCard: le,
        QCardSection: K,
        QBanner: ae,
        QInput: G,
        QIcon: H,
        QBtn: S,
        QTable: ne,
        QTd: J,
        QSelect: O,
        QToggle: ie,
        QTooltip: q
      }
    }), o.component("EditableTable", ke);
  }
};
export {
  ke as EditableTable,
  Ee as default
};
