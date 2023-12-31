import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'

const Loading = () => {
	const antIcon = (
		<LoadingOutlined
			style={{
				color: 'white',
			}}
			spin
		/>
	)

	return <Spin indicator={antIcon} />
}

export default Loading