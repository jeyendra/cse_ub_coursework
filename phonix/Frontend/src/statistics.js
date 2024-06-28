import {Chart} from "react-google-charts";


export var vow_data = [
    ["Vowel Sound", "Word Count", {role: "style"}],
    ['ɔɪ/OY', 2878], ['ʊ/UH', 4747], ['aʊ/AW', 4940], ['u/UW', 17683], ['ɔ/AO', 19495], ['aɪ/AY', 22989], ['eɪ/EY', 24989], ['oʊ/OW', 34023], ['æ/AE', 41671], ['ɝ/ER', 44079], ['ɑ/AA', 47076], ['ɛ/EH', 48214], ['i/IY', 60697], ['ɪ/IH', 79401], ['ʌ/AH', 117846]
];

export var const_data = [
    ["Consonent Sound", "Word Count", {role: "style"}],
    ['ʒ/ZH', 878], ['ð/DH', 1145], ['θ/TH', 7071], ['tʃ/CH', 8063], ['j/Y', 8149], ['dʒ/JH', 12541], ['w/W', 13345], ['ŋ/NG', 13542], ['h/HH', 14532], ['ʃ/SH', 15506], ['v/V', 17461], ['g/G', 22431], ['f/F', 26879], ['z/Z', 29703], ['b/B', 35116], ['p/P', 40860], ['d/D', 52495], ['m/M', 53478], ['k/K', 71612], ['ɹ/R', 79417], ['s/S', 83769], ['t/T', 83920], ['l/L', 87581], ['n/N', 95145]
];
var colors = ['#264c99', '#a52a0d', '#bf7200',
    '#0c7012', '#720072', '#007294',
    '#b72153', '#4c7f00', '#8a2222',
    '#244a6f', '#723372', '#197f72',
    '#7f7f0c', '#4c2699', '#ac5600',
    '#680505', '#4b0c4d', '#256d49',
    '#3f577c', '#2c2e81', '#895619',
    '#10a017', '#8a0e62', '#d30b79',
    '#754227', '#7e930e', '#1f5969',
    '#4c6914', '#8e7b0e', '#084219',
    '#57270c']
for (var i = 1; i < vow_data.length; i++) {
    vow_data[i].push(colors[Math.floor((Math.random() * 100) % colors.length)])
}
for (var i = 1; i < const_data.length; i++) {
    const_data[i].push(colors[Math.floor((Math.random() * 100) % colors.length)])
}
export const vow_options = {
    title: "Consonant Sound Vs Word Frequency ",
    legend: {position: 'bottom'},
    subtitle: 'Sales, Expenses, and Profit: 2014-2017',
};


export const src_data = [
    ["Task", "Hours per Day"],
    ["wordnet", 29968],
    ["conceptnet", 26214],
    ["Cmudict", 75327],
    ["webster dictionary", 92834],
];
export const src_optns = {
    title: "Data Sources and Words Distribution",
    is3D: true,
};

var positionData = [
    ['phoneme', 'initial', 'middle', 'final'],
    ['ʒ', 63, 811, 4], ['ð', 137, 950, 60], ['ɔɪ', 60, 2572, 250], ['ʊ', 29, 4742, 2], ['aʊ', 650, 4170, 179], ['θ', 1297, 4937, 944], ['tʃ', 2150, 5175, 832], ['j', 2049, 6168, 18], ['dʒ', 3288, 8301, 1159], ['w', 5039, 8540, 45], ['ŋ', 15, 6499, 7298], ['h', 9913, 4359, 455], ['ʃ', 3017, 11198, 1477], ['u', 181, 16700, 1154], ['v', 3922, 12099, 2019], ['ɔ', 1552, 17955, 426], ['g', 7006, 14689, 1370], ['aɪ', 1015, 21317, 1537], ['eɪ', 522, 19813, 5401], ['f', 9321, 16853, 1516], ['z', 1776, 12495, 16435], ['b', 13836, 22205, 710], ['oʊ', 2112, 28657, 6530], ['p', 15538, 26026, 2124], ['æ', 6951, 36711, 61], ['ɝ', 587, 30774, 15185], ['ɛ', 5284, 45496, 319], ['ɑ', 3590, 43431, 5471], ['d', 12678, 30728, 13549], ['m', 14948, 35635, 6673], ['i', 544, 38888, 28225], ['k', 20669, 48321, 10773], ['ɹ', 10465, 72985, 3276], ['l', 8366, 71111, 15648], ['ɪ', 9177, 86570, 2], ['t', 9439, 69893, 17772], ['s', 22760, 53638, 21673], ['n', 5666, 81467, 25475], ['ʌ', 8730, 142124, 7956]
  ];

  var pos_options = {
    legend: { position: 'top', maxLines: 3 },
    bar: { groupWidth: '75%' },
    isStacked: true,
  };

function DisplayStats() {
    var ans = <div>
        <Chart options={vow_options} chartType="ColumnChart" width="100%" height="400px" data={const_data}/>
        <Chart chartType="ColumnChart" width="100%" height="400px" data={vow_data}/>
        <Chart options={pos_options} chartType="ColumnChart" width="100%" height="400px" data={positionData}/>
        <Chart
            chartType="PieChart"
            data={src_data}
            options={src_optns}
            width={"100%"}
            height={"400px"}
        />
    </div>
    return ans
}


export default DisplayStats;