const TEST_PARTS = [
  {
    id: 'A', title: 'C# 基礎與資料結構', duration: 20, color: '#2e6f95',
    description: '語法、集合與基本資料結構',
    questions: [
      { id: 'a1', type: 'choice', category: '數值型別與運算', prompt: '以下程式依序輸出什麼？\n\nint x = 5; int y = 2;\nConsole.WriteLine(x / y);\nConsole.WriteLine((double)x / y);', choices: ['2、2', '2、2.5', '2.5、2.5', '編譯錯誤'], answer: '1' },
      { id: 'a2', type: 'choice', category: '陣列索引', prompt: 'int[] a = { 3, 5, 7, 9 };\nConsole.WriteLine(a[a.Length - 2]);\n\n輸出為何？', choices: ['3', '5', '7', '9'], answer: '2' },
      { id: 'a3', type: 'short', category: '迴圈控制', prompt: 'for (int i = 1; i <= 10; i += 2)\n{ Console.WriteLine(i); }\n\nConsole.WriteLine 共執行幾次？', answer: ['5'], referenceAnswer: '5 次。i 依序為 1、3、5、7、9。' },
      { id: 'a4', type: 'choice', category: '字串處理', prompt: 'string s = "ABCDE";\nConsole.WriteLine(s.Substring(1, 3));\n\n輸出為何？', choices: ['ABC', 'BCD', 'BCDE', 'CDE'], answer: '1' },
      { id: 'a5', type: 'short', category: 'List 操作', prompt: 'List<int> nums = new() { 5, 2, 8, 2, 9 };\nnums.Remove(2);\n\n之後 nums.Count 是多少？', answer: ['4'], referenceAnswer: '4。Remove(2) 只會移除第一個值為 2 的元素。' },
      { id: 'a6', type: 'choice', category: '資料結構選擇', prompt: '大量學生資料需要「依學生編號快速取得成績」，最適合的結構是？', choices: ['List<int>', 'Stack<int>', 'Dictionary<string, int>', 'Queue<int>'], answer: '2' },
      { id: 'a7', type: 'choice', category: '資料結構選擇', prompt: '只要判斷學生編號是否出現過，最適合的結構是？', choices: ['List<string>', 'HashSet<string>', 'Queue<string>', '二維陣列'], answer: '1' },
      { id: 'a8', type: 'short', category: '流程控制', prompt: 'int sum = 0;\nfor (int i = 1; i <= 5; i++) { if (i % 2 == 0) continue; sum += i; }\n\n最後 sum 是多少？', answer: ['9'], referenceAnswer: '9。continue 跳過偶數，累加 1 + 3 + 5。' },
      { id: 'a9', type: 'short', category: '陣列索引', prompt: 'for (int i = 0; i <= data.Length; i++)\n    Console.WriteLine(data[i]);\n\n請簡短說明錯誤，並寫出一個修正方向。', keywords: ['index', '範圍', '<', 'length'], referenceAnswer: 'i == data.Length 時會存取不存在的 data[data.Length]，造成索引超出範圍。將條件改成 i < data.Length。' }
    ]
  },
  {
    id: 'B', title: 'Trace / Debug', duration: 20, color: '#8c5e2a',
    description: '追蹤流程、找出錯誤與修正方向',
    questions: [
      { id: 'b1', type: 'choice', category: '條件判斷', prompt: 'int n = 7;\nif (n % 2 == 0) Console.WriteLine("A");\nelse Console.WriteLine("B");\n\n輸出為何？', choices: ['A', 'B', 'AB', '沒有輸出'], answer: '1' },
      { id: 'b2', type: 'choice', category: '變數追蹤', prompt: 'int x = 3;\nfor (int i = 0; i < 3; i++) x += i;\nConsole.WriteLine(x);\n\n輸出為何？', choices: ['3', '5', '6', '9'], answer: '2' },
      { id: 'b3', type: 'short', category: '邊界條件', prompt: '若二分搜尋的 right 初始值設為 arr.Length（而不是 arr.Length - 1），可能造成什麼問題？', keywords: ['index', '範圍', 'out', '越界'], referenceAnswer: '可能把 mid 算成 arr.Length，存取 arr[arr.Length] 而索引超出範圍；最後合法索引是 arr.Length - 1。' },
      { id: 'b4', type: 'choice', category: '參考型別', prompt: 'List<int> b = a; 之後 b.Add(9)。若 a 原本是 List<int>，a 會如何？', choices: ['不變', '也多出 9', '變成 null', '編譯錯誤'], answer: '1' },
      { id: 'b5', type: 'short', category: '除錯策略', prompt: '程式偶爾輸出錯誤答案。請寫出你會先檢查的一個具體位置或方法。', keywords: ['測資', '輸入', '邊界', 'print', 'console', '中間'], referenceAnswer: '例如先用最小值、最大值、重複值等邊界測資重現問題，並輸出關鍵迴圈中的中間變數確認何時偏離預期。' }
    ]
  },
  {
    id: 'C', title: 'Algorithm / 解題策略', duration: 20, color: '#4d7c59',
    description: '複雜度、策略判斷與資料結構搭配',
    questions: [
      { id: 'c1', type: 'choice', category: '時間複雜度', prompt: '在已排序陣列中找一個值，最適合的基本演算法是？', choices: ['線性搜尋 O(n)', '二分搜尋 O(log n)', '泡沫排序 O(n²)', 'DFS O(V+E)'], answer: '1' },
      { id: 'c2', type: 'choice', category: '時間複雜度', prompt: '兩層各跑 n 次的巢狀迴圈，主要時間複雜度是？', choices: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], answer: '3' },
      { id: 'c3', type: 'choice', category: '資料結構選擇', prompt: '需要依「先進先出」順序處理工作，應使用？', choices: ['Stack', 'Queue', 'HashSet', 'Dictionary'], answer: '1' },
      { id: 'c4', type: 'short', category: '解題拆解', prompt: '給一串整數，找出是否有重複值。請用一句話描述一個 O(n) 左右的做法。', keywords: ['hashset', 'set', '集合', '加入', '出現'], referenceAnswer: '逐一加入 HashSet；若 Add 回傳 false（或元素已存在），就代表找到重複值。' },
      { id: 'c5', type: 'short', category: '邊界條件', prompt: '讀入 N 筆資料後要找最大值。請列出至少一個你會特別測試的邊界情況。', keywords: ['1', '空', '負', '相同', '最大', '最小'], referenceAnswer: '例如 N=1、全部都是負數、所有數值相同、最大值出現在第一筆或最後一筆。' }
    ]
  },
  {
    id: 'D', title: 'Coding / 實作能力', duration: 30, color: '#714f91',
    description: '以解題規劃做初步診斷（非線上評測）',
    questions: [
      { id: 'd1', type: 'long', category: '實作規劃', prompt: '題目：讀入 N 與 N 個整數，輸出不重複數字的個數。\n\n請寫出你的 C# 解題步驟或程式骨架。', keywords: ['hashset', 'set', 'readline', 'split', 'add', 'count'], referenceAnswer: '建立 HashSet<int>，讀取每個整數後呼叫 Add，最後輸出 set.Count。也應處理輸入分行或同一行的情況。' },
      { id: 'd2', type: 'long', category: '實作規劃', prompt: '題目：給一個字串，判斷它是否為迴文（正讀、反讀相同）。\n\n請寫出你的實作策略，或 C# 程式骨架。', keywords: ['left', 'right', 'while', 'char', 'length', 'i', 'j'], referenceAnswer: '設定 left=0、right=s.Length-1；當 left < right 時比較 s[left] 和 s[right]，不同就不是迴文，否則兩端向內移動。' },
      { id: 'd3', type: 'long', category: '測試與除錯', prompt: '上面任選一題：請列出至少兩個你會自己測試的測資或邊界情況。', keywords: ['空', '1', '單', '重複', '相同', '大小寫', '偶數', '奇數'], referenceAnswer: '例如空字串、單一字元、奇數／偶數長度迴文、非迴文、全部相同字元；集合題可測全部重複、全部不同、負數。' }
    ]
  }
];

const TRAINING_ROADMAP = [
  { dates: '8/15–8/23', title: '診斷期', focus: '完成 Diagnostic、建立 Skill Profile；競賽 50%／模考 50%。' },
  { dates: '8/24–9/20', title: '基礎強化期', focus: 'C# 資料型態、流程、陣列、函式、Dictionary／Stack／Queue；每週 1 次 90–120 分 Coding。' },
  { dates: '9/21–10/11', title: '模考加重 I', focus: '統測專二主題＋C#；加入 BFS／DFS 與 Mini Contest。競賽 40%／模考 60%。' },
  { dates: '10/12–10/18', title: '模考前一週', focus: '統測錯題與 Flash Card；Coding 只維持手感。' },
  { dates: '10/19–10/20', title: '第一次模考', focus: '正式模考後立即做錯題原因分析。' },
  { dates: '10/21–11/9', title: '競賽衝刺 I', focus: '歷屆題、限時解題、Debug／Algorithm；每週 2 次 Mini Contest。' },
  { dates: '11/10–11/16', title: '競賽衝刺 II', focus: '完整競賽模擬；不使用 Google／AI，訓練讀題→Coding→Debug。' },
  { dates: '11/17–11/23', title: '最後一週', focus: '熟悉題型、輕量複習與 Edge Case，不學新主題。' },
  { dates: '11/24 起', title: '工科技藝競賽', focus: '正式比賽週；平台停止大量出新題。' },
  { dates: '競賽後–12/14', title: '模考回歸', focus: '統測主科重整；以錯題與觀念回顧為主。' },
  { dates: '12/15–12/16', title: '第二次模考', focus: '統測 100%；做成績分析，與第一次模考比較各科變化。' },
  { dates: '12/17–12/21', title: '長期強化 I', focus: '依第二次模考的弱科建立短題組與每週複盤。' }
];

const TRAINING_PACKS = [
  { id: 'csharp-core', label: '8/24–9/20', title: 'C# 核心與資料結構', source: '競賽基礎：C#／演算法', questions: [
    { q: '要以學生編號快速查成績，最適合哪個結構？', c: ['List<int>', 'Dictionary<string, int>', 'Stack<int>', 'Queue<int>'], a: 1, e: 'Dictionary 以鍵查值，適合「學生編號 → 成績」。' },
    { q: 'int x = 7 / 2; 的 x 值為何？', c: ['3', '3.5', '4', '編譯錯誤'], a: 0, e: '兩個運算元皆為 int，C# 做整數除法，結果為 3。' },
    { q: '需要「後進先出」處理資料時，應使用？', c: ['Queue', 'Dictionary', 'Stack', 'HashSet'], a: 2, e: 'Stack 的規則是 LIFO（後進先出）。' }
  ] },
  { id: 'logic-algorithm', label: '9/21–11/23', title: 'Debug、演算法與競賽手感', source: '競賽衝刺：Trace／BFS／DFS／Edge Case', questions: [
    { q: '已排序陣列找目標值，通常優先選？', c: ['二分搜尋', '泡沫排序', 'DFS', '列舉所有排列'], a: 0, e: '二分搜尋時間複雜度為 O(log n)。' },
    { q: '陣列 data 長度為 n，正確走訪索引的迴圈條件為？', c: ['i <= n', 'i < n', 'i <= n - 2', 'i > n'], a: 1, e: '最後一個合法索引是 n - 1，因此條件應為 i < n。' },
    { q: 'BFS 最典型的資料結構是？', c: ['Stack', 'Queue', 'Dictionary', 'Array'], a: 1, e: 'BFS 以 Queue 維持先進先出的走訪順序。' }
  ] },
  { id: 'pro2-mock', label: '9/21–12/16', title: '統測專二：數位邏輯／微處理機／程式設計', source: '依官方資電類專二考試大綱改寫', questions: [
    { q: '十進位 13 轉為二進位為？', c: ['1011', '1101', '1110', '1001'], a: 1, e: '13 = 8 + 4 + 1，所以是 1101。' },
    { q: '下列何者為 AND 閘輸出為 1 的必要條件？', c: ['至少一個輸入為 1', '所有輸入皆為 1', '所有輸入皆為 0', '輸入不同'], a: 1, e: 'AND 只有在所有輸入皆為 1 時輸出 1。' },
    { q: '程式設計實習中，先檢查輸入範圍與陣列邊界，主要是在避免？', c: ['語法上色錯誤', '執行期索引錯誤', '網路斷線', '磁碟重組'], a: 1, e: '邊界檢查可避免越界等執行期錯誤。' }
  ] },
  { id: 'pro1-rebuild', label: '11/25–12/21', title: '統測專一：基本電學／電子學', source: '依官方資電類專一考試大綱改寫', questions: [
    { q: '在直流電路中，歐姆定律為？', c: ['V = IR', 'P = I / V', 'R = VI', 'I = VR'], a: 0, e: '歐姆定律：電壓 V = 電流 I × 電阻 R。' },
    { q: '串聯電阻電路的電流特性為？', c: ['各元件電流相同', '各元件電壓相同', '總電阻小於任一電阻', '沒有電壓降'], a: 0, e: '串聯只有一條電流路徑，因此各元件電流相同。' },
    { q: '整流與濾波電路的主要目的為？', c: ['把交流轉成較平穩直流', '放大聲音', '儲存程式', '增加電阻'], a: 0, e: '整流先轉單向電流，濾波再降低漣波。' }
  ] }
];
