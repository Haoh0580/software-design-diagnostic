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
