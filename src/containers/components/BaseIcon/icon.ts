export type BaseIconName =
  | 'alignCenter'
  | 'alignLeft'
  | 'alignRight'
  | 'bold'
  | 'fontColor'
  | 'italic'
  | 'middleAlign'
  | 'plus'
  | 'redo'
  | 'underline'
  | 'undo'
  | 'success'
  | 'info'
  | 'warning'
  | 'error';

const icon: Record<BaseIconName, string[]> = {
  alignCenter: [
    'M142.2 227.6h739.6v56.9H142.2zM142.2 568.9h739.6v56.9H142.2zM256 398.2h512v56.9H256zM256 739.6h512v56.9H256z',
  ],
  alignLeft: [
    'M627.712 788.48c11.305 0 20.48-9.155 20.48-20.48s-9.175-20.48-20.48-20.48H218.46c-11.305 0-20.48 9.155-20.48 20.48s9.175 20.48 20.48 20.48h409.252zM832.86 583.68h-614.4c-11.305 0-20.48 9.155-20.48 20.48s9.175 20.48 20.48 20.48h614.4c11.305 0 20.48-9.155 20.48-20.48s-9.175-20.48-20.48-20.48zM832.86 256h-614.4c-11.305 0-20.48 9.155-20.48 20.48s9.175 20.48 20.48 20.48h614.4c11.305 0 20.48-9.155 20.48-20.48S844.165 256 832.86 256zM218.46 460.8h409.252c11.305 0 20.48-9.155 20.48-20.48s-9.175-20.48-20.48-20.48H218.46c-11.305 0-20.48 9.155-20.48 20.48s9.155 20.48 20.48 20.48z',
  ],
  alignRight: [
    'M832.86 747.52H423.588a20.48 20.48 0 1 0 0 40.96H832.84a20.48 20.48 0 0 0 0.02-40.96z m20.48-143.36a20.48 20.48 0 0 0-20.48-20.48h-614.4a20.48 20.48 0 1 0 0 40.96h614.4a20.48 20.48 0 0 0 20.48-20.48zM832.86 256h-614.4a20.48 20.48 0 1 0 0 40.96h614.4a20.48 20.48 0 1 0 0-40.96z m0 163.84H423.588a20.48 20.48 0 1 0 0 40.96H832.84a20.48 20.48 0 0 0 0.02-40.96z',
  ],
  bold: [
    'M724.342857 477.028571c38.4-40 61.942857-94.057143 61.942857-153.485714v-11.657143C786.285714 188.914286 685.6 89.142857 561.485714 89.142857H223.314286c-17.257143 0-31.314286 14.057143-31.314286 31.314286v776.114286c0 18.628571 15.085714 33.714286 33.714286 33.714285h364.228571c133.714286 0 242.057143-107.657143 242.057143-240.571428v-12.571429c0-83.428571-42.742857-156.914286-107.657143-200.114286zM301.714286 198.857143h256.8c65.257143 0 118.057143 50.742857 118.057143 113.485714v10.857143c0 62.628571-52.914286 113.485714-118.057143 113.485714H301.714286V198.857143z m418.971428 490.742857c0 71.885714-59.085714 130.171429-132 130.171429H301.714286V547.085714h286.971428c72.914286 0 132 58.285714 132 130.171429v12.342857z',
  ],
  fontColor: [
    'M650.496 597.333333H373.504l-68.266667 170.666667H213.333333l256-640h85.333334l256 640h-91.904l-68.266667-170.666667z m-34.133333-85.333333L512 251.093333 407.637333 512h208.725334zM128 853.333333h768v85.333334H128v-85.333334z',
  ],
  italic: [
    'M219.428571 949.714286l9.714286-48.571429q3.428571-1.142857 46.571429-12.285714t63.714286-21.428571q16-20 23.428571-57.714286 0.571429-4 35.428571-165.142857t65.142857-310.571429 29.714286-169.428571l0-14.285714q-13.714286-7.428571-31.142857-10.571429t-39.714286-4.571429-33.142857-3.142857l10.857143-58.857143q18.857143 1.142857 68.571429 3.714286t85.428571 4 68.857143 1.428571q27.428571 0 56.285714-1.428571t69.142857-4 56.285714-3.714286q-2.857143 22.285714-10.857143 50.857143-17.142857 5.714286-58 16.285714t-62 19.142857q-4.571429 10.857143-8 24.285714t-5.142857 22.857143-4.285714 26-3.714286 24q-15.428571 84.571429-50 239.714286t-44.285714 203.142857q-1.142857 5.142857-7.428571 33.142857t-11.428571 51.428571-9.142857 47.714286-3.428571 32.857143l0.571429 10.285714q9.714286 2.285714 105.714286 17.714286-1.714286 25.142857-9.142857 56.571429-6.285714 0-18.571429 0.857143t-18.571429 0.857143q-16.571429 0-49.714286-5.714286t-49.142857-5.714286q-78.857143-1.142857-117.714286-1.142857-29.142857 0-81.714286 5.142857t-69.142857 6.285714z',
  ],
  middleAlign: [
    'M740.43392 788.48c11.30496 0 20.48-9.15456 20.48-20.48s-9.17504-20.48-20.48-20.48L331.18208 747.52c-11.30496 0-20.48 9.15456-20.48 20.48s9.17504 20.48 20.48 20.48L740.43392 788.48zM863.49824 604.16c0-11.32544-9.17504-20.48-20.48-20.48l-614.4 0c-11.30496 0-20.48 9.15456-20.48 20.48s9.17504 20.48 20.48 20.48l614.4 0C854.3232 624.64 863.49824 615.48544 863.49824 604.16zM208.13824 276.48c0 11.32544 9.17504 20.48 20.48 20.48l614.4 0c11.30496 0 20.48-9.15456 20.48-20.48s-9.17504-20.48-20.48-20.48l-614.4 0C217.2928 256 208.13824 265.15456 208.13824 276.48zM740.43392 460.8c11.30496 0 20.48-9.15456 20.48-20.48s-9.17504-20.48-20.48-20.48L331.18208 419.84c-11.30496 0-20.48 9.15456-20.48 20.48s9.17504 20.48 20.48 20.48L740.43392 460.8z',
  ],
  plus: [
    'M896 468.571429H555.428571V100.571429h-86.857142v368H128c-5.028571 0-9.142857 4.114286-9.142857 9.142857v68.571428c0 5.028571 4.114286 9.142857 9.142857 9.142857h340.571429v368h86.857142V555.428571h340.571429c5.028571 0 9.142857-4.114286 9.142857-9.142857v-68.571428c0-5.028571-4.114286-9.142857-9.142857-9.142857z',
  ],
  redo: [
    'M611.783111 569.344L549.622519 644.740741h284.444444l-65.498074-265.481482-59.922963 72.666074c-35.422815-28.48237-108.278519-68.342519-238.667852-68.342518-202.827852 0-280.651852 206.01363-280.651852 206.013629s116.318815-132.778667 246.215111-132.778666c97.204148-0.037926 153.865481 74.827852 176.241778 112.526222z',
  ],
  underline: [
    'M512 725.333333c166.4 0 298.666667-132.266667 298.666667-298.666666V128c0-25.6-17.066667-42.666667-42.666667-42.666667s-42.666667 17.066667-42.666667 42.666667v298.666667c0 119.466667-93.866667 213.333333-213.333333 213.333333s-213.333333-93.866667-213.333333-213.333333V128c0-25.6-17.066667-42.666667-42.666667-42.666667s-42.666667 17.066667-42.666667 42.666667v298.666667c0 166.4 132.266667 298.666667 298.666667 298.666666zM853.333333 853.333333H170.666667c-25.6 0-42.666667 17.066667-42.666667 42.666667s17.066667 42.666667 42.666667 42.666667h682.666666c25.6 0 42.666667-17.066667 42.666667-42.666667s-17.066667-42.666667-42.666667-42.666667z',
  ],
  undo: [
    'M489.244444 568.888889l60.681482 75.851852H265.481481l64.474075-265.481482 60.681481 72.05926c34.133333-30.340741 109.985185-68.266667 238.933333-68.266667 201.007407 0 280.651852 204.8 280.651852 204.8S792.651852 455.111111 663.703704 455.111111c-98.607407 0-155.496296 75.851852-174.45926 113.777778z',
  ],
  success: [
    'M666.272 472.288l-175.616 192a31.904 31.904 0 0 1-23.616 10.4h-0.192a32 32 0 0 1-23.68-10.688l-85.728-96a32 32 0 1 1 47.744-42.624l62.144 69.6 151.712-165.888a32 32 0 1 1 47.232 43.2m-154.24-344.32C300.224 128 128 300.32 128 512c0 211.776 172.224 384 384 384 211.68 0 384-172.224 384-384 0-211.68-172.32-384-384-384',
  ],
  info: [
    'M512 97.52381c228.912762 0 414.47619 185.563429 414.47619 414.47619s-185.563429 414.47619-414.47619 414.47619S97.52381 740.912762 97.52381 512 283.087238 97.52381 512 97.52381z m36.571429 341.333333h-73.142858v292.571428h73.142858V438.857143z m0-121.904762h-73.142858v73.142857h73.142858v-73.142857z',
  ],
  warning: [
    'M512 64q190.016 4.992 316.512 131.488T960 512q-4.992 190.016-131.488 316.512T512 960q-190.016-4.992-316.512-131.488T64 512q4.992-190.016 131.488-316.512T512 64z m0 192q-26.016 0-43.008 19.008T453.984 320l23.008 256q2.016 14.016 11.488 22.496t23.488 8.512 23.488-8.512 11.488-22.496l23.008-256q2.016-26.016-15.008-44.992T511.936 256z m0 512q22.016-0.992 36.512-15.008t14.496-36-14.496-36.512T512 665.984t-36.512 14.496-14.496 36.512 14.496 36T512 768z',
  ],
  error: [
    'M512 97.52381c228.912762 0 414.47619 185.563429 414.47619 414.47619s-185.563429 414.47619-414.47619 414.47619S97.52381 740.912762 97.52381 512 283.087238 97.52381 512 97.52381z m129.29219 233.447619l-129.267809 129.29219-129.316571-129.29219-51.736381 51.736381 129.316571 129.267809-129.316571 129.316571 51.736381 51.736381L512 563.687619l129.29219 129.316571 51.736381-51.73638L563.687619 512l129.316571-129.29219-51.73638-51.736381z',
  ],
};

export default icon;
