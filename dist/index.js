import { Loading as M, QSpinnerRings as de, QCard as te, QCardSection as H, QBanner as ne, QInput as J, QIcon as ae, QBtn as A, QTooltip as K, QTable as ie, QTd as X, QSelect as se, QToggle as le, Quasar as oe } from "quasar";
import { ref as I, watch as P, watchEffect as re, onBeforeUnmount as ue, computed as Y, createBlock as O, openBlock as g, unref as s, withCtx as y, createVNode as E, createElementVNode as fe, toDisplayString as $, createCommentVNode as _, renderSlot as ce, withKeys as ge, createTextVNode as Q, createSlots as me, createElementBlock as R, Fragment as w, renderList as ee, normalizeStyle as ye, mergeProps as G } from "vue";
function pe(d, h) {
  const l = I([...d.modelValue ?? []]), b = /* @__PURE__ */ new Map();
  P(() => d.modelValue, (t) => {
    l.value = [...t ?? []];
  });
  let v = !1;
  re(() => {
    d.loading ? v || (v = !0, setTimeout(() => {
      M.show({ spinner: de });
    }, 0)) : v && (v = !1, M.hide());
  }), ue(() => M.hide());
  const m = I(/* @__PURE__ */ new Set()), q = (t) => m.value.has(t), V = Y(() => m.value.size > 0), S = Y(
    () => (d.columns ?? []).filter((t) => t && t.name !== "actions")
  ), T = (t, o) => typeof t == "function" ? !!t({ row: o, props: d }) : !!t, F = (t, o) => !!(t != null && t.editType) && (t.editable === void 0 ? !0 : T(t.editable, o)) && !T(t.hideInEdit, o), U = (t, o) => T(t == null ? void 0 : t.disabled, o), D = (t, o) => T(t == null ? void 0 : t.readonly, o), j = (t, o) => T(t == null ? void 0 : t.required, o), k = (t) => t.editValueField || (typeof t.field == "string" ? t.field : t.name), L = () => {
    var o;
    if (d.useExternalAdd) {
      h("add");
      return;
    }
    if (V.value) {
      (o = d.confirmError) == null || o.call(d, "Termine a edição atual antes de criar um novo registo.");
      return;
    }
    const t = { _isNew: !0, lifeCycleStatus: "ACTIVE" };
    for (const f of S.value) {
      if (!F(f, t)) continue;
      const p = k(f);
      p && (t[p] = f.editType === "toggle" ? !1 : null);
    }
    l.value.unshift(t), m.value.add(t);
  }, z = (t) => {
    var p;
    if (d.useExternalEdit) {
      h("edit", t);
      return;
    }
    if (V.value) {
      (p = d.confirmError) == null || p.call(d, "Termine a edição atual antes de editar outro registo.");
      return;
    }
    t._backup = { ...t }, m.value.add(t);
    const o = Array.from(new Set(
      (d.columns || []).flatMap((u) => {
        const c = [];
        return u.dependsOn && c.push(u.dependsOn), Array.isArray(u.resetOnChangeOf) ? c.push(...u.resetOnChangeOf) : u.resetOnChangeOf && c.push(u.resetOnChangeOf), c;
      }).filter(Boolean)
    )), f = P(
      () => o.map((u) => t[u]),
      (u, c) => {
        const r = new Set(
          o.filter((e, a) => (u == null ? void 0 : u[a]) !== (c == null ? void 0 : c[a]))
        );
        (d.columns || []).forEach((e) => {
          if (e.dependsOn && e.matchField && r.has(e.dependsOn)) {
            const a = k(e);
            a && (t[a] = null);
          }
        }), (d.columns || []).forEach((e) => {
          if ((Array.isArray(e.resetOnChangeOf) ? e.resetOnChangeOf : e.resetOnChangeOf ? [e.resetOnChangeOf] : []).some((n) => r.has(n)))
            if (typeof e.onReset == "function")
              e.onReset({ row: t, col: e, changedFields: Array.from(r) });
            else {
              const n = k(e);
              n && (t[n] = null);
            }
        });
      },
      { deep: !1 }
    );
    b.set(t, f);
  }, B = (t) => {
    t._isNew ? l.value = l.value.filter((f) => f !== t) : t._backup && (Object.assign(t, t._backup), delete t._backup);
    const o = b.get(t);
    o && o(), b.delete(t), m.value.delete(t), h("update:modelValue", [...l.value]);
  }, W = async (t) => {
    var p, u, c;
    const o = (d.columns || []).find((r) => {
      if (!r || r.name === "actions" || !F(r, t) || !j(r, t) || U(r, t) || D(r, t)) return !1;
      const e = k(r), a = e ? t[e] : void 0;
      return a == null || a === "";
    });
    if (o) {
      const r = o.label || o.name;
      (p = d.confirmError) == null || p.call(d, `O campo "${r}" é obrigatório.`);
      return;
    }
    const f = (d.columns || []).filter((r) => r.uniqueKey);
    if (f.length > 0) {
      const r = (i) => f.map((C) => i[k(C)] ?? "").join("|"), e = r(t);
      if (l.value.filter((i) => r(i) === e).length - 1 > 0) {
        h("validation-error", {
          kind: "unique",
          fields: f.map((i) => k(i)),
          labels: f.map((i) => i.label || i.name),
          values: f.map((i) => t[k(i)]),
          row: t
        });
        return;
      }
    }
    try {
      const r = await new Promise((e, a) => {
        h("save", t, { resolve: e, reject: a });
      });
      Object.assign(t, r), delete t._backup, delete t._isNew, (u = b.get(t)) == null || u(), b.delete(t), m.value.delete(t), h("update:modelValue", [...l.value]);
    } catch (r) {
      const e = r && r.message ? r.message : "Erro ao salvar a linha.";
      (c = d.confirmError) == null || c.call(d, e), console.error("Erro ao salvar a linha:", r);
    }
  }, x = async (t) => {
    var o, f;
    if (m.value.size > 0 && !q(t)) {
      (o = d.confirmError) == null || o.call(d, "Termine a edição atual antes de apagar outro registo.");
      return;
    }
    try {
      if (!await ((f = d.confirmDelete) == null ? void 0 : f.call(
        d,
        "Deseja realmente apagar este registo? Esta ação não poderá ser desfeita."
      ))) return;
      await new Promise((c, r) => {
        h("delete", t, { resolve: c, reject: r });
      });
      const u = b.get(t);
      u && u(), b.delete(t), l.value = l.value.filter((c) => c !== t), m.value.delete(t), h("update:modelValue", [...l.value]);
    } catch (p) {
      console.error("Erro ao apagar a linha:", p);
    }
  };
  return P(V, (t) => {
    h("editing-change", !!t);
  }, { immediate: !0 }), {
    rows: l,
    editingRows: m,
    isEditing: q,
    isEditingAnyRow: V,
    addRow: L,
    editRow: z,
    cancelEdit: B,
    saveRow: W,
    deleteRow: x,
    search: (t) => h("search", (t || "").trim()),
    toggleStatus: (t) => h("toggle-status", t),
    visibleColumns: S
  };
}
const he = { class: "text-subtitle2 text-primary" }, be = {
  key: 0,
  style: { width: "100%" }
}, Ce = { key: 0 }, Oe = {
  key: 1,
  class: "q-gutter-sm"
}, ve = {
  __name: "EditableTable",
  props: {
    title: String,
    modelValue: Array,
    columns: Array,
    selectOptions: {
      type: Object,
      default: () => ({})
    },
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
    "custom-action",
    "validation-error",
    "editing-change"
  ],
  setup(d, { emit: h }) {
    var f, p, u, c, r;
    const l = d, b = h, v = I(""), m = I({
      sortBy: ((f = l.pagination) == null ? void 0 : f.sortBy) ?? "id",
      descending: ((p = l.pagination) == null ? void 0 : p.descending) ?? !1,
      page: ((u = l.pagination) == null ? void 0 : u.page) ?? 1,
      rowsPerPage: ((c = l.pagination) == null ? void 0 : c.rowsPerPage) ?? 10,
      rowsNumber: ((r = l.pagination) == null ? void 0 : r.rowsNumber) ?? 0
    });
    P(() => l.pagination, (e) => {
      m.value = {
        sortBy: (e == null ? void 0 : e.sortBy) ?? "id",
        descending: (e == null ? void 0 : e.descending) ?? !1,
        page: (e == null ? void 0 : e.page) ?? 1,
        rowsPerPage: (e == null ? void 0 : e.rowsPerPage) ?? 10,
        rowsNumber: (e == null ? void 0 : e.rowsNumber) ?? 0
      };
    }), P(() => {
      var e;
      return (e = l.pagination) == null ? void 0 : e.rowsNumber;
    }, (e) => {
      m.value.rowsNumber = e ?? 0;
    });
    const {
      rows: q,
      isEditing: V,
      isEditingAnyRow: S,
      addRow: T,
      editRow: F,
      cancelEdit: U,
      saveRow: D,
      deleteRow: j,
      search: k,
      toggleStatus: L,
      visibleColumns: z
    } = pe(l, b), B = (e, a) => typeof e == "function" ? !!e({ row: a, props: l }) : !!e, W = (e, a) => (e.editable === void 0 ? !0 : B(e.editable, a)) && !B(e.hideInEdit, a) && !!e.editType, x = (e, a) => B(e.disabled, a), N = (e, a) => B(e.readonly, a), Z = Y(() => (e) => l.extraActions.filter((a) => typeof a.visible == "function" ? a.visible(e) : a.visible !== !1)), t = (e) => {
      m.value = {
        ...e.pagination,
        rowsNumber: m.value.rowsNumber
      }, b("request", e);
    }, o = (e, a) => {
      if (e.editType === "select") {
        let n = [];
        if (Array.isArray(e.editOptions) && (n = e.editOptions), !n.length && typeof e.editOptions == "function") {
          const i = e.editOptions({ row: a, props: l });
          Array.isArray(i) && (n = i);
        }
        if (!n.length && e.editOptionsKey && (n = (l.selectOptions || {})[e.editOptionsKey] || []), !n.length && e.editOptionsKey && l[e.editOptionsKey] && (n = l[e.editOptionsKey]), e.dependsOn && e.matchField) {
          const i = a[e.dependsOn];
          n = n.filter((C) => C[e.matchField] === i);
        }
        return {
          options: n,
          optionValue: e.optionValueKey || "value",
          optionLabel: e.optionLabelKey || "label",
          emitValue: !0,
          mapOptions: !0,
          dense: !0,
          outlined: !0,
          placeholder: e.placeholder || "Selecionar",
          disable: x(e, a),
          readonly: N(e, a)
        };
      }
      return e.editType === "toggle" ? { dense: !0, keepColor: !0, color: "primary", disable: x(e, a), readonly: N(e, a) } : {
        dense: !0,
        outlined: !0,
        placeholder: e.placeholder || e.label,
        disable: x(e, a),
        readonly: N(e, a)
      };
    };
    return (e, a) => (g(), O(s(te), {
      class: "q-pa-none",
      flat: "",
      bordered: ""
    }, {
      default: y(() => [
        E(s(H), { class: "text-h6 q-pa-none" }, {
          default: y(() => [
            E(s(ne), {
              dense: "",
              "inline-actions": "",
              class: "text-primary bg-grey-3"
            }, {
              action: y(() => [
                l.hideSearchInput ? _("", !0) : (g(), O(s(J), {
                  key: 0,
                  outlined: "",
                  label: "Pesquisar por Nome, descrição, Código",
                  dense: "",
                  style: { width: "300px" },
                  color: "white",
                  modelValue: v.value,
                  "onUpdate:modelValue": a[1] || (a[1] = (n) => v.value = n),
                  onKeyup: a[2] || (a[2] = ge((n) => s(k)(v.value), ["enter"])),
                  disable: s(S)
                }, {
                  append: y(() => [
                    v.value ? (g(), O(s(ae), {
                      key: 0,
                      name: "close",
                      onClick: a[0] || (a[0] = () => {
                        v.value = "", s(k)("");
                      }),
                      class: "cursor-pointer"
                    })) : _("", !0)
                  ]),
                  _: 1
                }, 8, ["modelValue", "disable"])),
                l.hideSearchButton ? _("", !0) : (g(), O(s(A), {
                  key: 1,
                  outline: "",
                  style: { color: "goldenrod" },
                  dense: "",
                  icon: "search",
                  onClick: a[3] || (a[3] = (n) => s(k)(v.value)),
                  disable: s(S),
                  class: "q-ml-sm"
                }, {
                  default: y(() => [
                    E(s(K), { class: "bg-primary" }, {
                      default: y(() => a[6] || (a[6] = [
                        Q("Pesquisar")
                      ])),
                      _: 1,
                      __: [6]
                    })
                  ]),
                  _: 1
                }, 8, ["disable"])),
                l.hideAddButton ? _("", !0) : (g(), O(s(A), {
                  key: 2,
                  outline: "",
                  style: { color: "goldenrod" },
                  dense: "",
                  icon: "add",
                  class: "q-ml-sm",
                  onClick: a[4] || (a[4] = (n) => l.useExternalAdd ? b("add") : s(T)()),
                  disable: s(S)
                }, {
                  default: y(() => [
                    E(s(K), { class: "bg-primary" }, {
                      default: y(() => [
                        Q("Criar novos " + $(l.title), 1)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }, 8, ["disable"])),
                ce(e.$slots, "action-buttons")
              ]),
              default: y(() => [
                fe("span", he, $(l.title), 1)
              ]),
              _: 3
            })
          ]),
          _: 3
        }),
        E(s(H), { class: "q-pa-md" }, {
          default: y(() => [
            E(s(ie), {
              rows: s(q),
              columns: l.columns,
              "row-key": "id",
              flat: "",
              dense: "",
              separator: "horizontal",
              pagination: m.value,
              "onUpdate:pagination": a[5] || (a[5] = (n) => m.value = n),
              "rows-per-page-options": l.rowsPerPageOptions,
              "pagination-label": (n, i, C) => `${n}-${i} de ${C} registros`,
              onRequest: t
            }, me({
              "body-cell-actions": y(({ row: n }) => [
                E(s(X), { class: "text-center" }, {
                  default: y(() => [
                    s(V)(n) ? (g(), R("div", Ce, [
                      E(s(A), {
                        dense: "",
                        flat: "",
                        icon: "check",
                        color: "green",
                        onClick: (i) => s(D)(n)
                      }, null, 8, ["onClick"]),
                      E(s(A), {
                        dense: "",
                        flat: "",
                        icon: "close",
                        color: "orange",
                        onClick: (i) => s(U)(n)
                      }, null, 8, ["onClick"])
                    ])) : (g(), R("div", Oe, [
                      l.hideToggleStatus ? _("", !0) : (g(), O(s(A), {
                        key: 0,
                        dense: "",
                        flat: "",
                        icon: n.lifeCycleStatus === "ACTIVE" ? "toggle_on" : "toggle_off",
                        color: n.lifeCycleStatus === "ACTIVE" ? "green" : "grey",
                        onClick: (i) => s(L)(n),
                        disable: s(S)
                      }, null, 8, ["icon", "color", "onClick", "disable"])),
                      l.hideEdit ? _("", !0) : (g(), O(s(A), {
                        key: 1,
                        dense: "",
                        flat: "",
                        icon: "edit",
                        color: "primary",
                        onClick: (i) => l.useExternalEdit ? b("edit", n) : s(F)(n)
                      }, null, 8, ["onClick"])),
                      l.hideDelete ? _("", !0) : (g(), O(s(A), {
                        key: 2,
                        dense: "",
                        flat: "",
                        icon: "delete",
                        color: "red",
                        onClick: (i) => s(j)(n)
                      }, null, 8, ["onClick"])),
                      (g(!0), R(w, null, ee(Z.value(n), (i, C) => (g(), O(s(A), {
                        key: C,
                        dense: "",
                        flat: "",
                        icon: i.icon,
                        color: i.color || "primary",
                        onClick: (ke) => b(i.emit || "extra-action", n)
                      }, {
                        default: y(() => [
                          E(s(K), { class: "bg-primary" }, {
                            default: y(() => [
                              Q($(i.tooltip), 1)
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
              ee(s(z), (n) => ({
                name: `body-cell-${n.name}`,
                fn: y(({ row: i }) => [
                  E(s(X), {
                    style: ye(n.style),
                    class: "q-pa-xs"
                  }, {
                    default: y(() => [
                      s(V)(i) && W(n, i) ? (g(), R("div", be, [
                        n.editType === "select" ? (g(), O(s(se), G({
                          key: 0,
                          modelValue: i[n.editValueField || n.field],
                          "onUpdate:modelValue": (C) => i[n.editValueField || n.field] = C
                        }, o(n, i), { class: "full-width" }), null, 16, ["modelValue", "onUpdate:modelValue"])) : n.editType === "toggle" ? (g(), O(s(le), G({
                          key: 1,
                          modelValue: i[n.editValueField || n.field],
                          "onUpdate:modelValue": (C) => i[n.editValueField || n.field] = C
                        }, o(n, i)), null, 16, ["modelValue", "onUpdate:modelValue"])) : (g(), O(s(J), G({
                          key: 2,
                          modelValue: i[n.editValueField || n.field],
                          "onUpdate:modelValue": (C) => i[n.editValueField || n.field] = C
                        }, o(n, i), { class: "full-width" }), null, 16, ["modelValue", "onUpdate:modelValue"]))
                      ])) : (g(), R(w, { key: 1 }, [
                        Q($(typeof n.field == "function" ? n.field(i) : i[n.field] ?? "—"), 1)
                      ], 64))
                    ]),
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
}, Ve = {
  install(d) {
    d.use(oe, {
      components: {
        QCard: te,
        QCardSection: H,
        QBanner: ne,
        QInput: J,
        QIcon: ae,
        QBtn: A,
        QTable: ie,
        QTd: X,
        QSelect: se,
        QToggle: le,
        QTooltip: K
      }
    }), d.component("EditableTable", ve);
  }
};
export {
  ve as EditableTable,
  Ve as default
};
