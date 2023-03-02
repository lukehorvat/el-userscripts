function Form({ params }) {
  const [item, setItem] = useState(params.item);
  const [action, setAction] = useState(params.action);
  const [sets, setSets] = useState(params.sets);
  const [showEmpty, setShowEmpty] = useState(params.showEmpty);
  const [hideNPCs, setHideNPCs] = useState(params.hideNPCs);
  const [showHosters, setShowHosters] = useState(params.showHosters);
  const [showOwners, setShowOwners] = useState(params.showOwners);
  const itemInput = useRef();

  useEffect(() => {
    itemInput.current.focus(); // autofocus it
  }, [sets]);

  return html`
    <form
      name="querybot"
      action=${window.location.pathname}
      class="card mt-2 p-2 small"
    >
      <div class="row g-2">
        <div class="col-6">
          <label class="form-label">Item to look for (regexp allowed):</label>
          <input
            class="form-control form-control-sm"
            type="text"
            name="item"
            value=${item}
            onChange=${(event) => setItem(event.target.value)}
            ref=${itemInput}
          />
        </div>
        <div class="col">
          <label class="form-label">Sets:</label>
          <select
            class="form-select form-select-sm"
            name="sets"
            value=${sets}
            onChange=${(event) => {
              const { value } = event.target;
              setSets(value);
              setItem(value);
            }}
          >
            <option value=""></option>
            <option value="@aire ings">aire ings</option>
            <option value="@all removals">all removals</option>
            <option value="@all rings">all rings</option>
            <option value="@animaltoken">animaltoken</option>
            <option value="@attrib removals">attrib removals</option>
            <option value="@aug set">aug set</option>
            <option value="@bd set">bd set</option>
            <option value="@bronze set">bronze set</option>
            <option value="@c1 rings">c1 rings</option>
            <option value="@c2 rings">c2 rings</option>
            <option value="@crafting">crafting</option>
            <option value="@deathe ings">deathe ings</option>
            <option value="@earthe ings">earthe ings</option>
            <option value="@energye ings">energye ings</option>
            <option value="@firee ings">firee ings</option>
            <option value="@flowers">flowers</option>
            <option value="@full bd set">full bd set</option>
            <option value="@full bronze set">full bronze set</option>
            <option value="@full id set">full id set</option>
            <option value="@full iron set">full iron set</option>
            <option value="@full rd set">full rd set</option>
            <option value="@full steel set">full steel set</option>
            <option value="@full tit set">full tit set</option>
            <option value="@healthe ings">healthe ings</option>
            <option value="@id set">id set</option>
            <option value="@iron set">iron set</option>
            <option value="@leather set">leather set</option>
            <option value="@lifee ings">lifee ings</option>
            <option value="@magice ings">magice ings</option>
            <option value="@mattere ings">mattere ings</option>
            <option value="@minerals">minerals</option>
            <option value="@nexus removals">nexus removals</option>
            <option value="@ore">ore</option>
            <option value="@perk removals">perk removals</option>
            <option value="@potions">potions</option>
            <option value="@rd set">rd set</option>
            <option value="@spirite ings">spirite ings</option>
            <option value="@steel set">steel set</option>
            <option value="@tit set">tit set</option>
            <option value="@watere ings">watere ings</option>
          </select>
        </div>
        <div class="col">
          <label class="form-label">What do you want:</label>
          <select
            class="form-select form-select-sm"
            name="action"
            value=${action}
            onChange=${(event) => setAction(event.target.value)}
          >
            <option value="Buy">Buy</option>
            <option value="Sell">Sell</option>
            <option value="Both">Both</option>
          </select>
        </div>
      </div>
      <div class="row g-2 mt-2">
        <div class="col">
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              name="showzero"
              value="1"
              checked=${showEmpty}
              onChange=${(event) => setShowEmpty(event.target.checked)}
            />
            <label>Show empty slots</label>
          </div>
        </div>
        <div class="col">
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              name="antisocial"
              value="1"
              checked=${hideNPCs}
              onChange=${(event) => setHideNPCs(event.target.checked)}
            />
            <label>Hide NPCs (antisocial)</label>
          </div>
        </div>
        <div class="col">
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              name="showhosters"
              value="1"
              checked=${showHosters}
              onChange=${(event) => setShowHosters(event.target.checked)}
            />
            <label>Show hosters</label>
          </div>
        </div>
        <div class="col">
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              name="showowners"
              value="1"
              checked=${showOwners}
              onChange=${(event) => setShowOwners(event.target.checked)}
            />
            <label>Show owners</label>
          </div>
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-12">
          <input
            type="submit"
            value="Search"
            class="btn btn-primary btn-sm px-4"
          />
        </div>
      </div>
    </form>
  `;
}
