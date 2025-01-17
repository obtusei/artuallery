# Artuallery

**An Virtual Art Gallery**

## How to start the project

1. Clone the project
   `git clone github.com/obtusei/artuallery.git`

2. If you dont have pnpm installed, install it using `npm i -g pnpm`

3. For Development, run
   `pnpm dev
`

4. For Building the project, run `pnpm build`

5. For preview the build, run `pnpm preview`

## Changing the wall and floor

### For Wall

1. Go to `main.js` and find select option there in html string

```shell
...
<select id="wall-select" class="bg-black/10 rounded-xl px-2 py-1">
          <option value="wall_1.jpg" selected>Wall 1</option>
          <option value="wall_2.jpg">Wall 2</option>
          <option value="wall_3.jpg">Wall 3</option>
          <option value="wall_4.jpg">Wall 4</option>
          <option value="wall_5.jpg">Wall 5</option>
        </select>
        ...
```

2. Rename wall if you like
3. Change wall_1, wall_2 and so on images on `public` directory at root.

### For Floor

1. Go to `main.js` and find select option there in html string

```shell
...
<select id="floor-select" class="bg-black/10 rounded-xl px-2 py-1">
          <option value="floor_1.jpg" selected>Wall 1</option>
          <option value="floor_2.jpg">Floor 2</option>
          <option value="floor_3.jpg">Floor 3</option>
          <option value="floor_4.jpg">Floor 4</option>
          <option value="floor_5.jpg">Floor 5</option>
        </select>
        ...
```

2. Rename wall if you like
3. Change floor_1, floor_2 and so on images on `public` directory at root.
